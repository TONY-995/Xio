const canvas = document.getElementById('heart');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 2000;
const scale = window.innerWidth < 600 ? 10 : 15; 
let currentColor = '#ff4d6d'; // Color inicial (rosado)

function getHeartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
}

// Función para generar un color aleatorio brillante
function getRandomColor() {
    const colors = [
        '#ff4d6d', '#ff0000', '#00ffcc', '#0077ff', 
        '#ffcc00', '#9d00ff', '#ffffff', '#ff8800'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

class Particle {
    constructor() {
        this.t = Math.random() * Math.PI * 2;
        const target = getHeartPoint(this.t);
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.targetX = target.x * scale;
        this.targetY = target.y * scale;
        this.size = Math.random() * 2 + 1;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.92;
        this.force = 0.08;
    }

    update() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.1;

        const dx = (centerX + this.targetX * pulse) - this.x;
        const dy = (centerY + this.targetY * pulse) - this.y;

        this.vx += dx * this.force;
        this.vy += dy * this.force;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.fillStyle = currentColor; // Usa el color actual global
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    explode() {
        this.vx = (Math.random() - 0.5) * 60;
        this.vy = (Math.random() - 0.5) * 60;
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    // Fondo con estela (Motion Blur)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibuja estrellas más grandes
    ctx.fillStyle = 'white';
    for (let i = 0; i < 15; i++) { // Menos cantidad para que no saturen
        ctx.beginPath();
        // Genera una posición aleatoria
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        // El número 2 es el radio (tamaño). Súbelo si las quieres aún más grandes.
        ctx.arc(x, y, 2, 0, Math.PI * 2); 
        ctx.fill();
    }

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}


// Evento de clic mejorado: Explosión + Cambio de Color
window.addEventListener('mousedown', () => {
    currentColor = getRandomColor(); // Cambia el color de todas las partículas
    particles.forEach(p => p.explode());
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();

