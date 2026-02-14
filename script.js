const canvas = document.getElementById('heart');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 1500; // Un poco menos para que vaya fluido en móvil

// Función para obtener la escala (tamaño del corazón) según el dispositivo
function getScale() {
    return window.innerWidth < 600 ? 8 : 15;
}

// Ecuación matemática del corazón
function getHeartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
}

let currentColor = '#ff4d6d';

function getRandomColor() {
    const colors = ['#ff4d6d', '#ff0000', '#00ffcc', '#0077ff', '#ffcc00', '#9d00ff', '#ffffff', '#ff8800'];
    return colors[Math.floor(Math.random() * colors.length)];
}

class Particle {
    constructor() {
        this.t = Math.random() * Math.PI * 2;
        const point = getHeartPoint(this.t);
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = point.x;
        this.baseY = point.y;
        this.size = Math.random() * 2 + 1;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.9;
        this.force = 0.08;
    }

    update() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = getScale();
        const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.15; // Latido más marcado

        const targetX = centerX + this.baseX * scale * pulse;
        const targetY = centerY + this.baseY * scale * pulse;

        const dx = targetX - this.x;
        const dy = targetY - this.y;

        this.vx += dx * this.force;
        this.vy += dy * this.force;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    explode() {
        this.vx = (Math.random() - 0.5) * 60;
        this.vy = (Math.random() - 0.5) * 60;
    }
}

// Inicializar partículas
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    // 1. Fondo con estela suave
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Estrellas grandes y brillantes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Blanco con un toque de transparencia
    for (let i = 0; i < 10; i++) { // Dibujamos pocas por frame para que no saturen
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        // El número 3 es el tamaño. Si las quieres más grandes, cámbialo a 4 o 5.
        ctx.arc(x, y, 3, 0, Math.PI * 2); 
        ctx.fill();
    }

    // 3. Dibujar partículas del corazón
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// Eventos para explosión
const triggerExplosion = () => {
    currentColor = getRandomColor();
    particles.forEach(p => p.explode());
};

window.addEventListener('mousedown', triggerExplosion);
window.addEventListener('touchstart', triggerExplosion);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Las partículas se ajustan solas en el próximo frame
});

animate();
