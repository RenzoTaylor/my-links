const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const maxParticles = 100;
const mouse = {
    x: null,
    y: null,
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.xSpeed = Math.random() * 2 - 1; // Horizontal movement speed
        this.ySpeed = Math.random() * 2 - 1; // Vertical movement speed
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Move particles
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Bounce off the edges
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.xSpeed *= -1;
        }

        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.ySpeed *= -1;
        }

        // Adjust movement if near the mouse
        if (
            mouse.x &&
            mouse.y &&
            this.x < mouse.x + 50 &&
            this.x > mouse.x - 50 &&
            this.y < mouse.y + 50 &&
            this.y > mouse.y - 50
        ) {
            this.xSpeed += (Math.random() - 0.5) * 0.5;
            this.ySpeed += (Math.random() - 0.5) * 0.5;
        }
    }
}

function init() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let size = Math.random() * 5 + 1;
        let color = 'rgba(255, 255, 255, 0.8)';
        particles.push(new Particle(x, y, size, color));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
}

function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let distance = Math.sqrt(
                (particles[a].x - particles[b].x) ** 2 +
                (particles[a].y - particles[b].y) ** 2
            );

            if (distance < 100) {
                opacityValue = 1 - distance / 100;
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

init();
animate();