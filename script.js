const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultText = document.getElementById('result');

const sectors = [
    { color: '#6A0DAD', label: 'Скидка 10%', weight: 3 },
    { color: '#7B1FA2', label: 'Конфета', weight: 10 },
    { color: '#8E24AA', label: 'Скидка 5%', weight: 10 },
    { color: '#6A0DAD', label: 'Скидка 15%', weight: 1 },
    { color: '#7B1FA2', label: 'Не повезло', weight: 6 },
    { color: '#8E24AA', label: 'Мундштук', weight: 0.2 },
];

const totalSectors = sectors.length;
const arcSize = (2 * Math.PI) / totalSectors;
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

        // Сектор
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        let angle = startAngle + arcSize / 2;
        let x2 = centerX + Math.cos(angle) * radius;
        let y2 = centerY + Math.sin(angle) * radius;
        let grad = ctx.createLinearGradient(centerX, centerY, x2, y2);
        grad.addColorStop(0, sector.color);
        grad.addColorStop(1, lightenColor(sector.color, 0.1));
        ctx.fillStyle = grad;
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Текст
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px Segoe UI";
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 2;
        ctx.fillText(sector.label, radius - 15, 6);
        ctx.restore();
    });

    // Центр круга — фиолетовый круг
    const centerRadius = 40;
    ctx.beginPath();
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, centerRadius);
    centerGradient.addColorStop(0, "#c158dc");
    centerGradient.addColorStop(1, "#6a0dad");
    ctx.fillStyle = centerGradient;
    ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Отрисовка иконки подарка (кодом)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";

    // Коробка
    ctx.strokeRect(-10, -10, 20, 20);

    // Крышка
    ctx.beginPath();
    ctx.moveTo(-12, -10);
    ctx.lineTo(12, -10);
    ctx.stroke();

    // Лента вертикальная
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(0, 10);
    ctx.stroke();

    // Бантик
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.bezierCurveTo(-5, -20, -10, -5, 0, -5);
    ctx.moveTo(0, -10);
    ctx.bezierCurveTo(5, -20, 10, -5, 0, -5);
    ctx.stroke();

    ctx.restore();
}

function getRandomSectorIndex() {
    const totalWeight = sectors.reduce((sum, s) => sum + s.weight, 0);
    let rnd = Math.random() * totalWeight;
    for (let i = 0; i < sectors.length; i++) {
        rnd -= sectors[i].weight;
        if (rnd <= 0) return i;
    }
    return sectors.length - 1;
}

const POINTER_ANGLE = Math.PI / 2; // стрелка направо

let rotation = 0;

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    resultText.textContent = '';

    const selectedIndex = getRandomSectorIndex();
    const arcSize = (2 * Math.PI) / sectors.length;
    const extraRotations = 6;

    const sectorCenter = (selectedIndex + 0.5) * arcSize;

    // Правильный расчёт: поворот так, чтобы центр сектора оказался под стрелкой
    const rotationDelta = (extraRotations * 2 * Math.PI) + (POINTER_ANGLE - sectorCenter);

    rotation += rotationDelta;

    canvas.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';
    canvas.style.transform = `rotate(${rotation}rad)`;

    setTimeout(() => {
        resultText.textContent = `Вы выиграли: ${sectors[selectedIndex].label}`;
        isSpinning = false;
    }, 4000);
}
