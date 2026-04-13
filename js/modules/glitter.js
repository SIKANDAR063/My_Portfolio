class GlitterEffect {
    constructor() {
        this.container = document.getElementById('glitterContainer');
        this.particles = [];
        this.particleCount = 50;
        this.colors = [
            '#ffd166', // Gold
            '#4cc9f0', // Teal
            '#f72585', // Pink
            '#7b2cbf', // Purple
            '#4361ee', // Blue
            '#06d6a0'  // Green
        ];
        
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'glitter-particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const duration = Math.random() * 5 + 3;
        const delay = Math.random() * 5;
        const left = Math.random() * 100;
        const opacity = Math.random() * 0.8 + 0.2;
        
        // Apply styles
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${opacity};
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        
        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            left: left,
            size: size,
            color: color
        });
    }

    animate() {
        // Periodically create new particles
        setInterval(() => {
            // Remove old particles
            if (this.particles.length > this.particleCount) {
                const oldParticle = this.particles.shift();
                if (oldParticle.element.parentNode) {
                    oldParticle.element.remove();
                }
            }
            
            // Create new particle
            this.createParticle();
        }, 500);
    }
}

// Initialize glitter effect
document.addEventListener('DOMContentLoaded', () => {
    const glitter = new GlitterEffect();
    
    // Add interactive glitter on skill items
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const rect = item.getBoundingClientRect();
            createSkillGlitter(rect);
        });
    });
    
    function createSkillGlitter(rect) {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const glitter = document.createElement('div');
                glitter.className = 'skill-glitter';
                
                const x = Math.random() * rect.width;
                const y = Math.random() * rect.height;
                const size = Math.random() * 4 + 2;
                const color = ['#ffd166', '#4cc9f0', '#f72585'][Math.floor(Math.random() * 3)];
                const duration = Math.random() * 0.5 + 0.3;
                
                glitter.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: 50%;
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    z-index: 100;
                    box-shadow: 0 0 ${size * 2}px ${color};
                    animation: glitterPop ${duration}s ease-out forwards;
                `;
                
                document.body.appendChild(glitter);
                
                // Remove after animation
                setTimeout(() => {
                    glitter.remove();
                }, duration * 1000);
            }, i * 50);
        }
    }
    
    // Add CSS for skill glitter animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitterPop {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: scale(1) rotate(180deg);
                opacity: 1;
            }
            100% {
                transform: scale(0) rotate(360deg);
                opacity: 0;
            }
        }
        
        .skill-glitter {
            position: fixed !important;
            z-index: 9999 !important;
        }
    `;
    document.head.appendChild(style);
});