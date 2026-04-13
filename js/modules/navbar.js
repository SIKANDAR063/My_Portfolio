/**
 * Navbar Module (Enhanced)
 * Accessible, performant, SPA-safe navigation handler
 */

export class Navbar {
    constructor() {
        this.header = document.getElementById('header');
        this.hamburger = document.getElementById('hamburger');
        this.mobileNav = document.getElementById('mobileNav');
        this.mobileClose = document.getElementById('mobileClose');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        this.sections = document.querySelectorAll('section');

        this.isMenuOpen = false;
        this.scrollTicking = false;

        this.boundOnScroll = this.onScroll.bind(this);
        this.boundOnKeydown = this.onKeydown.bind(this);

        this.init();
    }

    /* =========================
       INIT
       ========================= */
    init() {
        this.setupAccessibility();
        this.setupObservers();
        this.attachEvents();
        this.onScroll();
    }

    destroy() {
        window.removeEventListener('scroll', this.boundOnScroll);
        document.removeEventListener('keydown', this.boundOnKeydown);
    }

    /* =========================
       ACCESSIBILITY
       ========================= */
    setupAccessibility() {
        this.hamburger.setAttribute('aria-label', 'Toggle navigation');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.mobileNav.setAttribute('aria-hidden', 'true');
    }

    /* =========================
       EVENTS
       ========================= */
    attachEvents() {
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        this.mobileClose.addEventListener('click', () => this.closeMobileMenu());

        this.navLinks.forEach(link =>
            link.addEventListener('click', () => this.closeMobileMenu())
        );

        window.addEventListener('scroll', this.boundOnScroll);
        document.addEventListener('keydown', this.boundOnKeydown);
    }

    onKeydown(e) {
        if (e.key === 'Escape' && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /* =========================
       MOBILE MENU
       ========================= */
    toggleMobileMenu() {
        this.isMenuOpen ? this.closeMobileMenu() : this.openMobileMenu();
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        document.body.classList.add('is-menu-open');

        this.mobileNav.classList.add('active');
        this.hamburger.classList.add('active');

        this.hamburger.setAttribute('aria-expanded', 'true');
        this.mobileNav.setAttribute('aria-hidden', 'false');

        this.mobileNav.querySelector('a')?.focus();
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        document.body.classList.remove('is-menu-open');

        this.mobileNav.classList.remove('active');
        this.hamburger.classList.remove('active');

        this.hamburger.setAttribute('aria-expanded', 'false');
        this.mobileNav.setAttribute('aria-hidden', 'true');

        this.hamburger.focus();
    }

    /* =========================
       SCROLL HANDLING
       ========================= */
    onScroll() {
        if (!this.scrollTicking) {
            window.requestAnimationFrame(() => {
                this.handleHeaderState();
                this.scrollTicking = false;
            });
            this.scrollTicking = true;
        }
    }

    handleHeaderState() {
        this.header.classList.toggle('scrolled', window.scrollY > 80);
    }

    /* =========================
       ACTIVE LINK (OBSERVER)
       ========================= */
    setupObservers() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.setActiveLink(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.6
            }
        );

        this.sections.forEach(section => observer.observe(section));
    }

    setActiveLink(id) {
        this.navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
        });
    }
}
