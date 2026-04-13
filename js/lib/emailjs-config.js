/**
 * EmailJS Manager – Portfolio Sikandar
 * Production-ready contact form handler
 */

/* =========================
   CONFIG
   ========================= */
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'm8qt6xU5vaNTBdHZ5',
    SERVICE_ID: 'service_2rvnc07',
    TEMPLATE_ID: 'template_a9zr09n',

    EMAIL_SETTINGS: {
        to_email: 'sikandarali3572@gmail.com',
        subject: 'New Portfolio Message'
    },

    FALLBACK: {
        enabled: true,
        storageKey: 'contactFormBackup',
        maxRetries: 3
    },

    VALIDATION: {
        name: { required: true, minLength: 2, maxLength: 100, pattern: /^[a-zA-Z\s]+$/ },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        subject: { required: true, minLength: 5, maxLength: 200 },
        message: { required: true, minLength: 10, maxLength: 2000 }
    },

    MESSAGES: {
        sending: '📤 Sending your message...',
        success: '✅ Message sent successfully!',
        error: '❌ Failed to send message.',
        validation: {
            required: 'This field is required',
            email: 'Invalid email address',
            minLength: 'Minimum {min} characters required',
            maxLength: 'Maximum {max} characters allowed',
            pattern: 'Invalid format'
        }
    }
};

/* =========================
   VALIDATOR
   ========================= */
class FormValidator {
    constructor(validationRules, messages) {
        this.rules = validationRules;
        this.messages = messages;
        this.errors = {};
    }

    validateField(name, value) {
        const rule = this.rules[name];
        if (!rule) return true;

        this.errors[name] = [];

        if (rule.required && !value.trim())
            this.errors[name].push(this.messages.required);

        if (rule.minLength && value.length < rule.minLength)
            this.errors[name].push(this.messages.minLength.replace('{min}', rule.minLength));

        if (rule.maxLength && value.length > rule.maxLength)
            this.errors[name].push(this.messages.maxLength.replace('{max}', rule.maxLength));

        if (rule.pattern && !rule.pattern.test(value))
            this.errors[name].push(this.messages.pattern);

        return this.errors[name].length === 0;
    }

    validateForm(data) {
        this.errors = {};
        return Object.keys(this.rules)
            .every(key => this.validateField(key, data[key] || ''));
    }
}

/* =========================
   EMAIL SERVICE
   ========================= */
class EmailService {
    constructor(config) {
        this.config = config;
        this.validator = new FormValidator(
            config.VALIDATION,
            config.MESSAGES.validation
        );

        if (window.emailjs) {
            emailjs.init(config.PUBLIC_KEY);
        }
    }

    async send(data) {
        if (!this.validator.validateForm(data)) {
            throw new Error('Validation failed');
        }

        return emailjs.send(
            this.config.SERVICE_ID,
            this.config.TEMPLATE_ID,
            {
                ...data,
                to_email: this.config.EMAIL_SETTINGS.to_email
            }
        );
    }
}

/* =========================
   UI HANDLER
   ========================= */
class ContactFormUI {
    constructor(service) {
        this.service = service;
        this.form = document.getElementById('contactForm');
        this.status = document.getElementById('formStatus');

        if (this.form) {
            this.form.addEventListener('submit', e => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.setStatus('sending');

        const data = Object.fromEntries(new FormData(this.form));

        try {
            await this.service.send(data);
            this.setStatus('success');
            this.form.reset();
        } catch (err) {
            this.setStatus('error', err.message);
        }
    }

    setStatus(state, message = '') {
        this.status.textContent =
            message || EMAILJS_CONFIG.MESSAGES[state];
        this.status.className = `form-status ${state}`;
    }
}

/* =========================
   INIT
   ========================= */
function initEmailJS() {
    const service = new EmailService(EMAILJS_CONFIG);
    new ContactFormUI(service);

    if (location.hostname === 'localhost') {
        window.__EmailJS_DEBUG__ = service;
    }
}

document.addEventListener('DOMContentLoaded', initEmailJS);
