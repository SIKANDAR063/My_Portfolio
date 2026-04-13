/**
 * Form Handler Module (Enhanced)
 * Production-ready contact form handler with EmailJS + Offline Fallback
 */

const DEFAULT_CONFIG = {
    PUBLIC_KEY: null,
    SERVICE_ID: null,
    TEMPLATE_ID: null,

    FALLBACK: {
        enabled: true,
        storageKey: 'contactFormBackup',
        retryInterval: 30000,
        maxRetries: 3
    },

    VALIDATION: {
        name: {
            required: true,
            minLength: 2,
            maxLength: 100,
            pattern: /^[a-zA-Z\s\-']+$/
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        subject: {
            required: true,
            minLength: 5,
            maxLength: 200
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 2000
        }
    },

    MESSAGES: {
        sending: '📤 Sending your message...',
        success: '✅ Message sent successfully! I’ll get back to you soon.',
        error: '❌ Failed to send message. Please try again later.',
        validation: {
            required: 'This field is required',
            minLength: 'Must be at least {min} characters',
            maxLength: 'Cannot exceed {max} characters',
            pattern: 'Please enter a valid value'
        }
    }
};

/* =========================
   UTILITIES
   ========================= */
const deepMerge = (target, source) => {
    const output = { ...target };
    if (typeof source !== 'object') return output;

    Object.keys(source).forEach(key => {
        if (
            typeof source[key] === 'object' &&
            source[key] !== null &&
            !Array.isArray(source[key])
        ) {
            output[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            output[key] = source[key];
        }
    });
    return output;
};

class FormHandler {
    constructor(config = {}) {
        this.config = deepMerge(DEFAULT_CONFIG, config);
        this.form = document.getElementById('contactForm');
        this.status = document.getElementById('formStatus');
        this.submitBtn = this.form?.querySelector('button[type="submit"]');

        this.emailJSReady = false;
        this.listenersAttached = false;

        if (this.form) this.init();
    }

    /* =========================
       INIT
       ========================= */
    async init() {
        await this.loadEmailJS();
        this.attachListeners();
        this.retryFailedSubmissions();
        console.log('FormHandler initialized');
    }

    async loadEmailJS() {
        if (!this.config.PUBLIC_KEY) return;

        if (window.emailjs) {
            emailjs.init(this.config.PUBLIC_KEY);
            this.emailJSReady = true;
            return;
        }

        try {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.async = true;

            await new Promise((res, rej) => {
                script.onload = res;
                script.onerror = rej;
                document.head.appendChild(script);
            });

            emailjs.init(this.config.PUBLIC_KEY);
            this.emailJSReady = true;
        } catch {
            this.emailJSReady = false;
        }
    }

    /* =========================
       EVENTS
       ========================= */
    attachListeners() {
        if (this.listenersAttached) return;

        this.form.addEventListener('submit', e => this.handleSubmit(e));
        this.form.addEventListener('input', e => {
            if (e.target.name) this.clearFieldError(e.target);
        });

        this.listenersAttached = true;
    }

    /* =========================
       VALIDATION
       ========================= */
    validateField(field) {
        const rules = this.config.VALIDATION[field.name];
        if (!rules) return true;

        const value = field.value.trim();
        let error = null;

        if (rules.required && !value) error = this.config.MESSAGES.validation.required;
        else if (rules.minLength && value.length < rules.minLength)
            error = this.config.MESSAGES.validation.minLength.replace('{min}', rules.minLength);
        else if (rules.maxLength && value.length > rules.maxLength)
            error = this.config.MESSAGES.validation.maxLength.replace('{max}', rules.maxLength);
        else if (rules.pattern && !rules.pattern.test(value))
            error = this.config.MESSAGES.validation.pattern;

        if (error) {
            this.showFieldError(field, error);
            field.setAttribute('aria-invalid', 'true');
            return false;
        }

        field.removeAttribute('aria-invalid');
        return true;
    }

    validateForm() {
        return [...this.form.elements]
            .filter(el => el.name)
            .every(el => this.validateField(el));
    }

    showFieldError(field, message) {
        const group = field.closest('.form-group');
        if (!group) return;

        group.classList.add('error');
        let msg = group.querySelector('.error-message');

        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'error-message';
            msg.setAttribute('role', 'alert');
            group.appendChild(msg);
        }
        msg.textContent = message;
    }

    clearFieldError(field) {
        const group = field.closest('.form-group');
        if (!group) return;

        group.classList.remove('error');
        const msg = group.querySelector('.error-message');
        if (msg) msg.remove();
    }

    /* =========================
       SUBMISSION
       ========================= */
    async handleSubmit(e) {
        e.preventDefault();
        if (!this.validateForm()) {
            this.showStatus('Please fix the errors above.', 'error');
            return;
        }

        this.setSubmitState('sending');
        const data = this.collectFormData();

        try {
            if (this.emailJSReady) {
                await emailjs.send(
                    this.config.SERVICE_ID,
                    this.config.TEMPLATE_ID,
                    data
                );
            } else {
                throw new Error('EmailJS unavailable');
            }

            this.showStatus(this.config.MESSAGES.success, 'success');
            this.form.reset();
        } catch {
            this.saveForRetry(data);
            this.showStatus(this.config.MESSAGES.error, 'error');
        } finally {
            this.setSubmitState('idle');
        }
    }

    collectFormData() {
        return Object.fromEntries(new FormData(this.form).entries());
    }

    /* =========================
       OFFLINE RETRY
       ========================= */
    saveForRetry(data) {
        if (!this.config.FALLBACK.enabled) return;

        const saved = JSON.parse(
            localStorage.getItem(this.config.FALLBACK.storageKey) || '[]'
        );

        saved.push({ ...data, retryCount: 0, ts: Date.now() });
        localStorage.setItem(this.config.FALLBACK.storageKey, JSON.stringify(saved));
    }

    async retryFailedSubmissions() {
        if (!navigator.onLine) return;

        const saved = JSON.parse(
            localStorage.getItem(this.config.FALLBACK.storageKey) || '[]'
        );

        const remaining = [];

        for (const item of saved) {
            if (item.retryCount >= this.config.FALLBACK.maxRetries) continue;
            try {
                await emailjs.send(
                    this.config.SERVICE_ID,
                    this.config.TEMPLATE_ID,
                    item
                );
            } catch {
                item.retryCount++;
                remaining.push(item);
            }
        }

        remaining.length
            ? localStorage.setItem(this.config.FALLBACK.storageKey, JSON.stringify(remaining))
            : localStorage.removeItem(this.config.FALLBACK.storageKey);
    }

    /* =========================
       UI
       ========================= */
    showStatus(msg, type) {
        if (!this.status) return;
        this.status.textContent = msg;
        this.status.className = `form-status ${type}`;
        this.status.setAttribute('aria-live', 'polite');
    }

    setSubmitState(state) {
        if (!this.submitBtn) return;
        this.submitBtn.disabled = state === 'sending';
        this.submitBtn.innerHTML =
            state === 'sending'
                ? '<i class="fas fa-spinner fa-spin"></i> Sending...'
                : '<i class="fas fa-paper-plane"></i> Send Message';
    }

    destroy() {
        this.form?.removeEventListener('submit', this.handleSubmit);
        this.listenersAttached = false;
    }
}

export { FormHandler };
