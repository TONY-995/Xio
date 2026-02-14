const canvas = document.getElementById('heart');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 2000;
// 1. Usamos una función para obtener la escala actual según el ancho de pantalla
let getScale = () => window.innerWidth < 600 ? 9 : 15; 
let currentColor = '#ff4d6d';

function getHeartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
}

function getRandomColor() {
    const colors = ['#ff4d6d', '#ff0000', '#00ffcc', '#0077ff', '#ffcc00', '#9d00ff', '#ffffff', '#ff8800'];
    return colors[Math.floor(Math.random() * colors.length)];
}

class Particle {
    constructor() {
        this.t = Math.random() * Math.PI * 2;
        const target = getHeartPoint(this.t);
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // 2. Guardamos solo el punto base, calcularemos la escala en el update
        this.baseX = target.x;
        this.baseY = target.y;
        this.size = Math.random() * 2 + 1;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.92;
        this.force = 0.08;
    }

   update() {
    // Esto garantiza que el corazón siempre use el centro de la pantalla actual
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.1;
    const currentScale = getScale(); 

    // Aquí sumamos el centro al objetivo
    const targetX = centerX + this.baseX * currentScale * pulse;
    const targetY = centerY + this.baseY * currentScale * pulse;
    
    // ... resto de tu código de dx, dy, vx, vy ...

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

// Inicialización
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estrellas
    ctx.fillStyle = 'white';
    for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 2, 0, Math.PI * 2); 
        ctx.fill();
    }

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// Eventos
window.addEventListener('mousedown', () => {
    currentColor = getRandomColor();
    particles.forEach(p => p.explode());
});

// 5. Soporte para pantallas táctiles (Celulares)
window.addEventListener('touchstart', (e) => {
    // e.preventDefault(); // Opcional: evita zoom al tocar rápido
    currentColor = getRandomColor();
    particles.forEach(p => p.explode());
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // No hace falta resetear partículas, el update() usará el nuevo getScale()
});

animate();
