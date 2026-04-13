/**
 * Scroll Effects Module (Enhanced & Safe)
 */

class ScrollEffects {
    constructor() {
        this.sections = [];
        this.parallaxElements = [];
        this.intersectionObservers = new Map();

        this.scrollProgress = 0;
        this.lastScrollY = window.scrollY;
        this.ticking = false;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Bind handlers once (IMPORTANT)
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleWheel = this.handleWheel.bind(this);

        this.init();
    }

    /* =========================
       INIT
       ========================= */
    init() {
        this.setupSections();
        this.setupParallax();
        this.setupScrollProgress();
        this.setupIntersectionObservers();
        this.setupSmoothScroll();

        this.update();
        this.setupEventListeners();

        console.log('Scroll Effects initialized');
    }

    setupEventListeners() {
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize);

        if (!this.isReducedMotion) {
            window.addEventListener('wheel', this.handleWheel, { passive: true });
        }
    }

    destroy() {
        this.intersectionObservers.forEach(obs => obs.disconnect());
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('wheel', this.handleWheel);

        document.querySelector('.scroll-progress')?.remove();
        document.querySelector('.section-indicators')?.remove();

        console.log('Scroll Effects destroyed');
    }

    /* =========================
       SCROLL
       ========================= */
    handleScroll() {
        if (this.ticking) return;

        this.ticking = true;
        requestAnimationFrame(() => {
            this.onScroll();
            this.ticking = false;
        });
    }

    onScroll() {
        this.scrollProgress = this.getScrollProgress();
        this.lastScrollY = window.scrollY;

        if (!this.isReducedMotion) {
            this.updateParallax();
        }

        this.updateActiveSection();
        this.updateScrollIndicators();
        this.triggerScrollEvents();
    }

    handleResize() {
        this.calculateSectionPositions();
        this.calculateParallaxPositions();
    }

    handleWheel(e) {
        if (Math.abs(e.deltaY) < 60) return;
        this.applyTiltEffect(e.deltaY);
    }

    /* =========================
       SECTIONS
       ========================= */
    setupSections() {
        this.sections = [...document.querySelectorAll('[data-section]')].map(el => ({
            element: el,
            id: el.id || el.dataset.section,
            top: 0,
            height: 0,
            progress: 0,
            isActive: false,
            isVisible: false
        }));

        this.calculateSectionPositions();
    }

    calculateSectionPositions() {
        this.sections.forEach(s => {
            const rect = s.element.getBoundingClientRect();
            s.top = rect.top + window.scrollY;
            s.height = rect.height;
        });
    }

    updateActiveSection() {
        const y = window.scrollY + window.innerHeight / 3;

        this.sections.forEach(section => {
            const active = y >= section.top && y < section.top + section.height;

            section.progress = Math.min(
                Math.max((y - section.top) / section.height, 0),
                1
            );

            if (active !== section.isActive) {
                section.isActive = active;
                this.handleSectionActivation(section);
            }
        });
    }

    handleSectionActivation(section) {
        section.element.classList.toggle('section-active', section.isActive);

        if (section.isActive && section.id) {
            if (location.hash !== `#${section.id}`) {
                history.replaceState(null, '', `#${section.id}`);
            }

            window.dispatchEvent(
                new CustomEvent('sectionActivated', {
                    detail: { sectionId: section.id }
                })
            );
        }
    }

    /* =========================
       PARALLAX
       ========================= */
    setupParallax() {
        if (this.isReducedMotion) return;

        this.parallaxElements = [...document.querySelectorAll('[data-parallax], .parallax')]
            .map(el => ({
                element: el,
                speed: parseFloat(el.dataset.parallaxSpeed) || 0.3,
                direction: el.dataset.parallaxDirection || 'vertical',
                startY: 0
            }));

        this.calculateParallaxPositions();
    }

    calculateParallaxPositions() {
        this.parallaxElements.forEach(p => {
            p.startY = p.element.getBoundingClientRect().top + window.scrollY;
        });
    }

    updateParallax() {
        const scrollY = window.scrollY;

        this.parallaxElements.forEach(p => {
            const delta = (scrollY - p.startY) * p.speed;

            let transform = '';
            switch (p.direction) {
                case 'horizontal':
                    transform = `translateX(${delta}px)`;
                    break;
                case 'rotate':
                    transform = `rotate(${delta * 0.05}deg)`;
                    break;
                case 'scale':
                    transform = `scale(${Math.min(1 + delta * 0.001, 1.3)})`;
                    break;
                default:
                    transform = `translateY(${delta}px)`;
            }

            p.element.style.transform = transform;
        });
    }

    /* =========================
       PROGRESS / INDICATORS
       ========================= */
    setupScrollProgress() {
        if (!document.querySelector('.scroll-progress')) {
            document.body.insertAdjacentHTML(
                'beforeend',
                `<div class="scroll-progress"></div>`
            );
        }
    }

    updateScrollIndicators() {
        document.querySelector('.scroll-progress')?.style.setProperty(
            'transform',
            `scaleX(${this.scrollProgress})`
        );
    }

    /* =========================
       UTILITIES
       ========================= */
    getScrollProgress() {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        return h > 0 ? window.scrollY / h : 0;
    }

    triggerScrollEvents() {
        document.documentElement.style.setProperty('--scroll-progress', this.scrollProgress);
        document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);

        window.dispatchEvent(
            new CustomEvent('customScroll', {
                detail: {
                    scrollY: window.scrollY,
                    progress: this.scrollProgress
                }
            })
        );
    }

    update() {
        this.onScroll();
    }
}

export { ScrollEffects };
