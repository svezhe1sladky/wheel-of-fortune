const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultText = document.getElementById('result');

const sectors = [
    { color: '#6A0DAD', label: 'Скидка 10%', weight: 3 },
    { color: '#7B1FA2', label: 'Конфетка', weight: 9 },
    { color: '#8E24AA', label: 'Скидка 5%', weight: 9 },
    { color: '#6A0DAD', label: 'Скидка 15%', weight: 1 },
    { color: '#7B1FA2', label: 'Повезет в следующий раз', weight: 10 },
    { color: '#8E24AA', label: 'Персональный мундштук', weight: 1 },
];

const totalSectors = sectors.length;
const arcSize = (2 * Math.PI) / totalSectors;
let currentRotation = 0;
let isSpinning = false;

function lightenColor(hex, percent) {
    let num = parseInt(hex.replace('#', ''), 16),
        amt = Math.round(2.55 * percent * 100),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;

    return '#' + (
        0x1000000 +
        (R < 255 ? R : 255) * 0x10000 +
        (G < 255 ? G : 255) * 0x100 +
        (B < 255 ? B : 255)
    ).toString(16).slice(1);
}

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sectors.forEach((sector, i) => {
        const startAngle = i * arcSize;
        const endAngle = startAngle + arcSize;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        let angle = startAngle + arcSize / 2;
        let x1 = centerX;
        let y1 = centerY;
        let x2 = centerX + Math.cos(angle) * radius;
        let y2 = centerY + Math.sin(angle) * radius;

        let grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, sector.color);
        grad.addColorStop(1, lightenColor(sector.color, 0.08));

        ctx.fillStyle = grad;
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#333";
        ctx.font = "bold 15px 'Segoe UI', sans-serif";
        ctx.fillText(sector.label, radius - 10, 5);
        ctx.restore();
    });

// Центр круга — круглая фиолетовая иконка
const centerRadius = 40;
ctx.beginPath();
const centerGradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, centerRadius);
centerGradient.addColorStop(0, "#b388ff");
centerGradient.addColorStop(1, "#512da8");
ctx.fillStyle = centerGradient;
ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
ctx.fill();

// Белая иконка подарка (упрощённая)
ctx.save();
ctx.translate(centerX, centerY);
ctx.fillStyle = "#fff";

// Коробка
ctx.fillRect(-10, -10, 20, 20);

// Крышка
ctx.fillStyle = "#f1f1f1";
ctx.fillRect(-12, -16, 24, 6);

// Лента вертикальная
ctx.fillStyle = "#c5cae9";
ctx.fillRect(-2, -10, 4, 20);

// Бантик
ctx.beginPath();
ctx.moveTo(0, -16);
ctx.lineTo(-6, -22);
ctx.lineTo(0, -19);
ctx.lineTo(6, -22);
ctx.closePath();
ctx.fillStyle = "#ffffff";
ctx.fill();

ctx.restore();


function getRandomSectorIndex() {
    const totalWeight = sectors.reduce((sum, s) => sum + s.weight, 0);
    let rnd = Math.random() * totalWeight;

    for (let i = 0; i < sectors.length; i++) {
        rnd -= sectors[i].weight;
        if (rnd <= 0) return i;
    }

    return sectors.length - 1;
}

function spin() {
    if (isSpinning) return;

    isSpinning = true;
    resultText.textContent = '';

    const selectedIndex = getRandomSectorIndex();
    const sectorAngle = arcSize;

    const extraRotations = 5;
    const pointerAngle = 0;
    const targetAngle = pointerAngle - (selectedIndex * sectorAngle) - (sectorAngle / 2);

    const totalAngle = extraRotations * 2 * Math.PI + targetAngle;
    currentRotation += totalAngle;

    canvas.style.transform = `rotate(${currentRotation}rad)`;

    setTimeout(() => {
        resultText.textContent = `Вы выиграли: ${sectors[selectedIndex].label}`;
        isSpinning = false;
    }, 4000);
}

spinBtn.addEventListener('click', spin);
drawWheel();
