class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initAnimations();
        this.initContactForm();
        this.initCopyButtons();
        this.initStatCounters();
        this.initProjectHoverEffects();
        this.initOrbInteractions();
    }

    initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuToggle.innerHTML = mobileMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close menu when clicking links
        mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initAnimations() {
        // GSAP animations
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate sections on scroll
        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        });
        
        // Animate skill bars
        document.querySelectorAll('.skill-progress').forEach(bar => {
            gsap.to(bar, {
                width: bar.dataset.width + '%',
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bar,
                    start: "top 90%",
                }
            });
        });
        
        // Typing animation
        const typingText = document.querySelector('.typing-animation');
        if (typingText) {
            const text = typingText.textContent;
            typingText.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    typingText.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }

    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Sending...</span>';
            submitBtn.disabled = true;
            
            try {
                // Using EmailJS (configure in settings)
                if (typeof emailjs !== 'undefined') {
                    await emailjs.sendForm(
                        'service_2rvnc07', // Your service ID
                        'template_a9zr09n', // Your template ID
                        contactForm,
                        'm8qt6xU5vaNTBdHZ5' // Your public key
                    );
                    
                    // Success message
                    submitBtn.innerHTML = '<i class="fas fa-check"></i><span>Message Sent!</span>';
                    submitBtn.style.background = 'linear-gradient(45deg, #06d6a0, #4cc9f0)';
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    // Fallback: Simulate success
                    submitBtn.innerHTML = '<i class="fas fa-check"></i><span>Message Sent!</span>';
                    submitBtn.style.background = 'linear-gradient(45deg, #06d6a0, #4cc9f0)';
                    contactForm.reset();
                }
            } catch (error) {
                // Error message
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Failed to Send</span>';
                submitBtn.style.background = 'linear-gradient(45deg, #f72585, #ff6b6b)';
                console.error('Form submission error:', error);
            }
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    initCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const text = btn.dataset.text;
                
                try {
                    await navigator.clipboard.writeText(text);
                    
                    // Visual feedback
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    btn.style.background = 'linear-gradient(45deg, #06d6a0, #4cc9f0)';
                    
                    // Reset after delay
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.style.background = '';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
        });
    }

    initStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.dataset.count);
            let current = 0;
            const increment = target / 50; // Adjust speed
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format number
                if (stat.dataset.count.includes('%')) {
                    stat.textContent = current.toFixed(1) + '%';
                } else if (target % 1 !== 0) {
                    stat.textContent = current.toFixed(1);
                } else {
                    stat.textContent = Math.round(current);
                }
            }, 30);
        });
    }

    initProjectHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const overlay = card.querySelector('.project-overlay');
                if (overlay) {
                    overlay.style.opacity = '1';
                }
                
                // Add glow effect
                card.style.boxShadow = '0 20px 40px rgba(123, 44, 191, 0.4)';
            });
            
            card.addEventListener('mouseleave', () => {
                const overlay = card.querySelector('.project-overlay');
                if (overlay) {
                    overlay.style.opacity = '0';
                }
                
                // Remove glow effect
                card.style.boxShadow = '';
            });
        });
    }

    initOrbInteractions() {
        const orbs = document.querySelectorAll('.orb');
        
        orbs.forEach(orb => {
            orb.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    height: 100%;
                    border: 2px solid ${orb.style.color || 'currentColor'};
                    border-radius: 50%;
                    animation: orbRipple 0.6s ease-out forwards;
                    pointer-events: none;
                `;
                
                orb.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add CSS for ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes orbRipple {
                0% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});