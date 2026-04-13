/**
 * Particles Background Module (Enhanced)
 * Optimized, accessible, and production-safe
 */

export class ParticlesBackground {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;

        this.mouse = { x: null, y: null, radius: 120 };
        this.animationId = null;
        this.isRunning = true;

        this.resizeTimeout = null;

        this.init();
    }

    /* =========================
       INIT
       ========================= */
    init() {
        if (this.prefersReducedMotion()) return;

        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    destroy() {
        cancelAnimationFrame(this.animationId);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }

    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /* =========================
       CANVAS
       ========================= */
    setupCanvas() {
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /* =========================
       PARTICLES
       ========================= */
    createParticles() {
        this.particles.length = 0;

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2.5 + 1,
            vx: Math.random() * 0.4 - 0.2,
            vy: Math.random() * 0.4 - 0.2,
            opacity: Math.random() * 0.5 + 0.2,
            color: this.getParticleColor()
        };
    }

    getParticleColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        const palette =
            theme === 'dark'
                ? ['#6c63ff', '#ff6b6b', '#4dccbd']
                : ['#6c63ff', '#ff6b6b', '#4dccbd', '#1a1a2e'];

        return palette[Math.floor(Math.random() * palette.length)];
    }

    /* =========================
       ANIMATION LOOP
       ========================= */
    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.updateParticle(p);
            this.drawParticle(p);
            this.connectParticles(p, i);
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateParticle(p) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x <= 0 || p.x >= this.canvas.width) p.vx *= -1;
        if (p.y <= 0 || p.y >= this.canvas.height) p.vy *= -1;

        // Mouse repulsion
        if (this.mouse.x !== null) {
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const distSq = dx * dx + dy * dy;
            const radiusSq = this.mouse.radius ** 2;

            if (distSq < radiusSq) {
                const force = (radiusSq - distSq) / radiusSq;
                p.x -= dx * force * 0.02;
                p.y -= dy * force * 0.02;
            }
        }
    }

    drawParticle(p) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    connectParticles(p, index) {
        for (let j = index + 1; j < this.particles.length; j++) {
            const other = this.particles[j];
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const distSq = dx * dx + dy * dy;
            const maxDist = 100;
            const maxDistSq = maxDist * maxDist;

            if (distSq < maxDistSq) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = p.color;
                this.ctx.globalAlpha = 0.15 * (1 - distSq / maxDistSq);
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(other.x, other.y);
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        }
    }

    /* =========================
       EVENTS
       ========================= */
    bindEvents() {
        this.onMouseMove = e => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        };

        this.onResize = () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
                this.createParticles();
            }, 200);
        };

        this.onVisibilityChange = () => {
            this.isRunning = !document.hidden;
            if (this.isRunning) this.animate();
        };

        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('resize', this.onResize);
        document.addEventListener('visibilitychange', this.onVisibilityChange);
    }
}
