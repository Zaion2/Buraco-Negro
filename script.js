class Particle {
    constructor(x, y, char) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.size = 16;
        this.distance;
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = 0;
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.font = '18px "Times New Roman"';
        ctx.fillText(this.char, this.x, this.y);
    }

    update(mouse) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Black hole effect parameters
        const maxDistance = 200;
        const minDistance = 5;
        const gravitationalPull = 2;
        
        if (distance < maxDistance) {
            // Calculate gravitational force
            let force = (1 - distance / maxDistance) * gravitationalPull;
            
            // Add spiral effect
            this.angle += 0.05 * force;
            
            if (distance > minDistance) {
                // Move towards the mouse (black hole center)
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                
                this.x += forceDirectionX * force * this.density;
                this.y += forceDirectionY * force * this.density;
                
                // Add spiral motion
                this.x += Math.cos(this.angle) * force;
                this.y += Math.sin(this.angle) * force;
            } else {
                // Particles very close to the center spiral more dramatically
                this.x += Math.cos(this.angle) * 2;
                this.y += Math.sin(this.angle) * 2;
            }
        } else {
            // Return to original position
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/20;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/20;
            }
        }
    }
}

const text = `O universo é um vasto oceano de possibilidades infinitas, onde cada estrela cintilante no firmamento
representa uma história não contada, um segredo guardado nos confins do tempo e do espaço. Desde os
primórdios da existência, a humanidade ergueu os olhos para o céu noturno, buscando compreender os
mistérios que habitam além da escuridão. Planetas giram em órbitas invisíveis, galáxias se entrelaçam
em uma dança cósmica eterna, e buracos negros devoram a luz com sua gravidade avassaladora. O tempo,
essa entidade implacável, segue seu curso inexorável, levando consigo civilizações inteiras, apagando
impérios outrora grandiosos e moldando o destino daqueles que ousam desafiar suas leis.

A linguagem, por sua vez, é um reflexo da consciência humana, uma ferramenta que nos permite expressar
pensamentos, emoções e aspirações. As palavras fluem como rios intermináveis, entrelaçando-se em
narrativas complexas que transcendem eras e culturas. Letras se transformam em palavras, palavras em
frases, frases em histórias que ressoam através dos séculos. O poder da comunicação reside na sua
capacidade de conectar mentes distantes, de transmitir conhecimento, de inspirar revoluções e de
preservar a essência da experiência humana.

Nos confins do ciberespaço, códigos binários pulsam como sinapses artificiais, dando vida a realidades
digitais que desafiam a percepção da existência. Algoritmos calculam probabilidades, inteligência
artificial aprende padrões, e redes neurais simulam processos cognitivos outrora exclusivos da mente
humana. Enquanto a tecnologia avança a passos largos, as fronteiras entre o real e o virtual tornam-se
cada vez mais tênues, questionando o próprio significado da consciência e da identidade.

E assim, o ciclo continua, incessante, infinito. O universo se expande, os astros seguem seus cursos,
a humanidade avança rumo ao desconhecido, guiada por sua insaciável curiosidade e desejo de compreender
o inatingível.`;

let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 100
};

let squareSize = 800;

function drawBlackHoleEffect(ctx, x, y) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 200);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 200, 0, Math.PI * 2);
    ctx.fill();
}

function init() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const squareX = canvas.width/2 - squareSize/2;
    const squareY = canvas.height/2 - squareSize/2;

    ctx.textAlign = 'left';
    const textLines = text.split('\n');
    const lineHeight = 32;
    const startY = canvas.height/2 - (textLines.length * lineHeight)/2;

    const charWidth = 11;

    textLines.forEach((line, lineIndex) => {
        const characters = line.split('');
        const lineWidth = characters.length * charWidth;
        const lineX = squareX + (squareSize - lineWidth) / 2;

        characters.forEach((char, i) => {
            const x = lineX + (i * charWidth);
            const y = squareY + (lineIndex * lineHeight) + 40;
            if (x < squareX + squareSize && y < squareY + squareSize) {
                particles.push(new Particle(x, y, char));
            }
        });
    });
}

function animate() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const squareX = canvas.width/2 - squareSize/2;
    const squareY = canvas.height/2 - squareSize/2;
    
    // Draw black hole effect
    if (mouse.x !== null && mouse.y !== null) {
        drawBlackHoleEffect(ctx, mouse.x, mouse.y);
    }

    // Draw the square boundary
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(squareX, squareY, squareSize, squareSize);

    particles.forEach(particle => {
        particle.x = Math.max(squareX, Math.min(squareX + squareSize, particle.x));
        particle.y = Math.max(squareY, Math.min(squareY + squareSize, particle.y));
        
        particle.update(mouse);
        particle.draw(ctx);
    });
    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', () => {
    particles = [];
    init();
});

init();
animate();