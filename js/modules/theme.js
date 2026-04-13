/**
 * Theme Manager (Enhanced & Production-Ready)
 */

export class ThemeManager {
    constructor() {
        this.html = document.documentElement;
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle?.querySelector('i');
        this.metaThemeColor = document.querySelector('meta[name="theme-color"]');
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    /* =========================
       INIT
       ========================= */
    init() {
        this.loadTheme();
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // System theme change listener
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light', false);
                }
            });
    }

    /* =========================
       THEME LOGIC
       ========================= */
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        this.setTheme(savedTheme || (prefersDark ? 'dark' : 'light'), false);
    }

    toggleTheme() {
        const current = this.html.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';

        this.setTheme(next, true);

        // Animate button (if motion allowed)
        if (this.themeToggle && !this.isReducedMotion) {
            this.themeToggle.style.transform = 'rotate(360deg) scale(1.15)';
            setTimeout(() => {
                this.themeToggle.style.transform = '';
            }, 300);
        }
    }

    setTheme(theme, persist = true) {
        this.html.setAttribute('data-theme', theme);

        if (persist) {
            localStorage.setItem('theme', theme);
        }

        this.updateIcon(theme);
        this.updateMetaThemeColor(theme);
        this.dispatchThemeEvent(theme);
    }

    /* =========================
       UI UPDATES
       ========================= */
    updateIcon(theme) {
        if (!this.themeIcon) return;

        // Show the action, not the state
        this.themeIcon.className =
            theme === 'dark'
                ? 'fas fa-moon'
                : 'fas fa-sun';

        this.themeToggle?.setAttribute(
            'aria-label',
            `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
        );
    }

    updateMetaThemeColor(theme) {
        if (!this.metaThemeColor) return;

        this.metaThemeColor.setAttribute(
            'content',
            theme === 'dark' ? '#0a0a14' : '#ffffff'
        );
    }

    dispatchThemeEvent(theme) {
        window.dispatchEvent(
            new CustomEvent('themeChanged', {
                detail: { theme }
            })
        );
    }

    /* =========================
       PUBLIC API
       ========================= */
    getTheme() {
        return this.html.getAttribute('data-theme');
    }

    isDark() {
        return this.getTheme() === 'dark';
    }
}
