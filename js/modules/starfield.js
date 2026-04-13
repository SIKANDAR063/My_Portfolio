// class Starfield {
//     constructor() {
//         this.canvas = document.getElementById('starfield');
//         this.ctx = this.canvas.getContext('2d');
//         this.stars = [];
//         this.starCount = 500;
//         this.speed = 0.5;
        
//         this.init();
//     }

//     init() {
//         // Set canvas size
//         this.resize();
//         window.addEventListener('resize', () => this.resize());
        
//         // Create stars
//         this.createStars();
        
//         // Start animation
//         this.animate();
//     }

//     resize() {
//         this.canvas.width = window.innerWidth;
//         this.canvas.height = window.innerHeight;
//     }

//     createStars() {
//         this.stars = [];
        
//         for (let i = 0; i < this.starCount; i++) {
//             this.stars.push({
//                 x: Math.random() * this.canvas.width,
//                 y: Math.random() * this.canvas.height,
//                 size: Math.random() * 3 + 1,
//                 speed: Math.random() * this.speed + 0.1,
//                 opacity: Math.random() * 0.8 + 0.2,
//                 color: this.getRandomStarColor(),
//                 twinkleSpeed: Math.random() * 0.05 + 0.01,
//                 twinklePhase: Math.random() * Math.PI * 2
//             });
//         }
//     }

//     getRandomStarColor() {
//         const colors = [
//             '#ffffff', // White
//             '#4cc9f0', // Teal
//             '#ffd166', // Yellow
//             '#f8f9fa', // Light
//             '#e9ecef'  // Lighter
//         ];
//         return colors[Math.floor(Math.random() * colors.length)];
//     }

//     animate() {
//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
//         // Update and draw stars
//         this.stars.forEach(star => {
//             // Update position
//             star.y += star.speed;
            
//             // Wrap around
//             if (star.y > this.canvas.height) {
//                 star.y = 0;
//                 star.x = Math.random() * this.canvas.width;
//             }
            
//             // Twinkle effect
//             const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
//             const currentOpacity = star.opacity * twinkle;
            
//             // Draw star with glow
//             this.ctx.beginPath();
//             this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
//             this.ctx.fillStyle = star.color;
//             this.ctx.globalAlpha = currentOpacity;
//             this.ctx.fill();
            
//             // Add glow
//             this.ctx.beginPath();
//             this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
//             const gradient = this.ctx.createRadialGradient(
//                 star.x, star.y, 0,
//                 star.x, star.y, star.size * 3
//             );
//             gradient.addColorStop(0, star.color);
//             gradient.addColorStop(1, 'transparent');
//             this.ctx.fillStyle = gradient;
//             this.ctx.fill();
            
//             this.ctx.globalAlpha = 1;
//         });
        
//         requestAnimationFrame(() => this.animate());
//     }
// }

// // Make it globally accessible for theme switcher
// window.initStarfield = function() {
//     new Starfield();
// };

// // Initialize
// document.addEventListener('DOMContentLoaded', () => {
//     if (document.body.getAttribute('data-theme') === 'dark') {
//         window.initStarfield();
//     }
// });