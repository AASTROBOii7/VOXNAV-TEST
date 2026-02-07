// VOXNAV Logic

window.onload = function () {
    // 1. Handle Intro
    handleIntro();

    // 2. Initialize Particles
    initParticles();

    // 3. User Auth (Existing)
    checkAuth();
};

function handleIntro() {
    const overlay = document.getElementById('intro-overlay');

    // Play logo animation (handled by CSS 'intro-reveal')
    // Wait 2.5 seconds then fade out
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000);
    }, 2000);
}

function checkAuth() {
    const user = localStorage.getItem('voxnav_username');
    const statusDiv = document.getElementById('account-status');
    const profileLink = document.getElementById('profile-link');
    const usernameDisplay = document.getElementById('username-display');

    if (statusDiv && user) {
        statusDiv.style.display = 'flex';
        usernameDisplay.innerText = user;
        profileLink.innerText = "My Account";
    }
}

// Particle System
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // Resize
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create Particles
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect lines
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 - dist / 1500})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}
