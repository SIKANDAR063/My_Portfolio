class ThemeSwitcher {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
        
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Add keyboard shortcut (Ctrl+Shift+T)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    setTheme(theme) {
        this.body.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        // Update icon
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-moon';
            this.createStars();
            this.createNebula();
        } else {
            icon.className = 'fas fa-sun';
            this.createClouds();
            this.createSun();
        }
        
        // Dispatch custom event
        const themeChangeEvent = new CustomEvent('themechange', { detail: { theme } });
        document.dispatchEvent(themeChangeEvent);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.currentTheme = newTheme;
        this.setTheme(newTheme);
        
        // Add animation effect
        this.themeToggle.classList.add('theme-changing');
        setTimeout(() => {
            this.themeToggle.classList.remove('theme-changing');
        }, 500);
    }

    createStars() {
        // Remove existing day elements
        document.querySelectorAll('.cloud, .sun').forEach(el => el.remove());
        
        // Create stars if they don't exist
        if (!document.querySelector('#starfield')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'starfield';
            document.body.appendChild(canvas);
            
            // Initialize starfield
            if (window.initStarfield) {
                window.initStarfield();
            }
        }
        
        // Show nebula
        const nebula = document.querySelector('.nebula-overlay');
        if (nebula) nebula.style.opacity = '1';
    }

    createClouds() {
        // Remove existing night elements
        document.querySelectorAll('#starfield').forEach(el => el.remove());
        
        // Hide nebula
        const nebula = document.querySelector('.nebula-overlay');
        if (nebula) nebula.style.opacity = '0';
        
        // Create clouds
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const cloud = document.createElement('div');
                cloud.className = 'cloud';
                
                const size = Math.random() * 100 + 50;
                const top = Math.random() * 100;
                const opacity = Math.random() * 0.4 + 0.2;
                const animationDelay = Math.random() * 20;
                
                cloud.style.cssText = `
                    width: ${size}px;
                    height: ${size / 2}px;
                    top: ${top}%;
                    opacity: ${opacity};
                    animation-delay: ${animationDelay}s;
                    filter: blur(${size / 10}px);
                `;
                
                document.body.appendChild(cloud);
                
                // Remove cloud after animation
                setTimeout(() => {
                    cloud.remove();
                }, 60000); // Match animation duration
            }, i * 2000);
        }
    }

    createSun() {
        const sun = document.createElement('div');
        sun.className = 'sun';
        
        sun.style.cssText = `
            position: fixed;
            top: 50px;
            right: 50px;
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, #ffd700, #ff8c00);
            border-radius: 50%;
            box-shadow: 0 0 60px #ffd700, 0 0 120px rgba(255, 215, 0, 0.5);
            z-index: -1;
            pointer-events: none;
            animation: sunPulse 4s ease-in-out infinite;
        `;
        
        document.body.appendChild(sun);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sunPulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 60px #ffd700, 0 0 120px rgba(255, 215, 0, 0.5);
                }
                50% {
                    transform: scale(1.1);
                    box-shadow: 0 0 80px #ffd700, 0 0 160px rgba(255, 215, 0, 0.7);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize theme switcher
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = new ThemeSwitcher();
    
    // Add CSS for theme transition
    const style = document.createElement('style');
    style.textContent = `
        .theme-changing {
            animation: themeChangeSpin 0.5s ease-in-out;
        }
        
        @keyframes themeChangeSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .sun {
            position: fixed;
            pointer-events: none;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);
});