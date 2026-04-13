class AboutAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.initOrbitHover();
        this.initKnowledgeSphere();
        this.initTimelineHover();
        this.initTypewriterEffect();
        this.initStatsCounter();
    }

    initOrbitHover() {
        const orbitDots = document.querySelectorAll('.orbit-dot');
        
        orbitDots.forEach(dot => {
            dot.addEventListener('mouseenter', () => {
                // Add pulse effect
                dot.style.animationPlayState = 'paused';
                setTimeout(() => {
                    dot.style.animationPlayState = 'running';
                }, 300);
                
                // Create ripple effect
                this.createRipple(dot);
            });
            
            dot.addEventListener('click', () => {
                const tooltip = dot.dataset.tooltip;
                this.showNotification(`Selected: ${tooltip}`);
            });
        });
    }

    initKnowledgeSphere() {
        const orbitingTags = document.querySelectorAll('.orbiting-tag');
        const sphere = document.querySelector('.sphere-container');
        
        orbitingTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                // Slow down sphere rotation
                sphere.style.animationPlayState = 'paused';
                sphere.style.transform = sphere.style.transform.replace(/rotateY\(.*?\)/, 'rotateY(0deg)');
                
                // Highlight the tag
                tag.style.transform = 'translate(-50%, -50%) scale(1.5)';
                tag.style.boxShadow = '0 0 30px var(--hologram-teal)';
                tag.style.zIndex = '10';
            });
            
            tag.addEventListener('mouseleave', () => {
                // Resume sphere rotation
                sphere.style.animationPlayState = 'running';
                
                // Reset tag
                tag.style.transform = 'translate(-50%, -50%)';
                tag.style.boxShadow = '';
                tag.style.zIndex = '1';
            });
            
            tag.addEventListener('click', () => {
                const course = tag.dataset.course;
                this.showNotification(`Course: ${course}`);
            });
        });
    }

    initTimelineHover() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            const content = item.querySelector('.timeline-content');
            const marker = item.querySelector('.timeline-marker');
            
            item.addEventListener('mouseenter', () => {
                // Animate marker
                marker.style.transform = 'scale(1.2)';
                marker.style.boxShadow = '0 0 20px var(--nebula-purple)';
                
                // Add glow to content
                content.style.boxShadow = 'var(--glow-purple)';
                
                // Animate connection line
                const connection = item.querySelector('.timeline-connection');
                if (connection) {
                    connection.style.background = 'linear-gradient(to bottom, rgba(123, 44, 191, 0.8), transparent)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                // Reset marker
                marker.style.transform = '';
                marker.style.boxShadow = '';
                
                // Reset content
                content.style.boxShadow = '';
                
                // Reset connection
                const connection = item.querySelector('.timeline-connection');
                if (connection) {
                    connection.style.background = 'linear-gradient(to bottom, rgba(123, 44, 191, 0.5), transparent)';
                }
            });
        });
    }

    initTypewriterEffect() {
        const introText = document.querySelector('.intro-text');
        if (!introText) return;
        
        const paragraphs = introText.querySelectorAll('p');
        paragraphs.forEach((para, index) => {
            const originalText = para.textContent;
            para.textContent = '';
            
            setTimeout(() => {
                this.typeWriter(para, originalText, 0);
            }, index * 500);
        });
    }

    typeWriter(element, text, i) {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(() => this.typeWriter(element, text, i), 30);
        }
    }

    initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number, .edu-value');
        
        statNumbers.forEach(stat => {
            if (!stat.textContent.includes('+') && !stat.textContent.includes('∞')) {
                this.animateCounter(stat);
            }
        });
    }

    animateCounter(element) {
        const target = parseFloat(element.textContent);
        const suffix = element.textContent.replace(/[0-9.]/g, '');
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = current.toFixed(suffix.includes('%') ? 1 : 0) + suffix;
        }, 30);
    }

    createRipple(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, currentColor 0%, transparent 70%);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: rippleExpand 0.6s ease-out forwards;
            pointer-events: none;
            opacity: 0.5;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'about-notification';
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, var(--nebula-purple), var(--star-blue));
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: var(--glow-purple);
            z-index: 9999;
            animation: slideIn 0.3s ease-out, slideOut 0.3s ease-out 2.7s forwards;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Add CSS for animations
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                @keyframes rippleExpand {
                    from {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0.8;
                    }
                    to {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove notification after animation
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    new AboutAnimations();
});