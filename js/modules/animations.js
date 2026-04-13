// Animations Module
export class AnimationManager {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.counters = document.querySelectorAll('.stat-number');
        this.fadeElements = document.querySelectorAll('.fade-in');

        this.prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        this.observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        this.observer = null;

        this.init();
    }

    /* =====================
       INIT
       ===================== */
    init() {
        if (this.prefersReducedMotion) {
            this.showElementsImmediately();
            return;
        }

        this.setupObserver();
        this.observeElements();
        this.animateSectionsOnLoad();
    }

    /* =====================
       INTERSECTION OBSERVER
       ===================== */
    setupObserver() {
        this.observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                });
            },
            this.observerOptions
        );
    }

    observeElements() {
        [...this.fadeElements, ...this.skillBars, ...this.counters]
            .forEach(el => this.observer.observe(el));
    }

    /* =====================
       ANIMATION HANDLER
       ===================== */
    animateElement(element) {
        if (element.classList.contains('skill-progress')) {
            this.animateSkillBar(element);
        } else if (element.classList.contains('stat-number')) {
            this.animateCounter(element);
        } else if (element.classList.contains('fade-in')) {
            element.classList.add('fade-in-visible');
        }
    }

    /* =====================
       SKILL BAR
       ===================== */
    animateSkillBar(bar) {
        const width = Number(bar.dataset.width);

        if (Number.isNaN(width)) return;

        bar.style.width = `${Math.min(width, 100)}%`;
        bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    /* =====================
       COUNTER
       ===================== */
    animateCounter(counter) {
        const target = Number(counter.dataset.count);
        if (Number.isNaN(target)) return;

        const duration = 2000;
        const startTime = performance.now();

        const update = currentTime => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const value = Math.floor(progress * target);

            counter.textContent = value.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    }

    /* =====================
       PAGE LOAD EFFECTS
       ===================== */
    animateSectionsOnLoad() {
        document.querySelectorAll('section').forEach((section, index) => {
            section.classList.add('fade-in');
            section.style.animationDelay = `${index * 0.1}s`;
        });
    }

    /* =====================
       ACCESSIBILITY
       ===================== */
    showElementsImmediately() {
        document
            .querySelectorAll('.fade-in, .skill-progress, .stat-number')
            .forEach(el => {
                el.classList.add('fade-in-visible');

                if (el.classList.contains('skill-progress')) {
                    el.style.width = `${el.dataset.width || 100}%`;
                }

                if (el.classList.contains('stat-number')) {
                    el.textContent = el.dataset.count || '0';
                }
            });
    }

    /* =====================
       CLEANUP (OPTIONAL)
       ===================== */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
}
