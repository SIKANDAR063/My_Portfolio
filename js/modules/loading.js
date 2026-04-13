// Loading Screen functionality
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const terminalLines = document.querySelectorAll('.terminal-line');
    
    // Typewriter effect for terminal lines
    function animateTerminal() {
        terminalLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = 1;
                line.style.transform = 'translateY(0)';
            }, index * 300);
        });
        
        // Hide loading screen after animation completes
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
            
            // Remove from DOM after transition
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, terminalLines.length * 300 + 1500);
    }
    
    // Start animation
    setTimeout(animateTerminal, 500);
    
    // Animate skill bars when they come into view
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;
                const width = progress.getAttribute('data-width');
                progress.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
    
    // Animate number counters
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.round(current * 10) / 10;
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
});