const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultText = document.getElementById('result');

const sectors = [
    { color: '#FF5252', label: 'Приз 1', weight: 1 },
    { color: '#FFEB3B', label: 'Приз 2', weight: 1 },
    { color: '#4CAF50', label: 'Приз 3', weight: 1 },
    { color: '#2196F3', label: 'Приз 4', weight: 1 },
    { color: '#9C27B0', label: 'Приз 5', weight: 1 },
    { color: '#FF9800', label: 'Приз 6', weight: 1 },
];

const totalWeight = sectors.reduce((sum, sector) => sum + sector.weight, 0);
const totalSectors = sectors.length;
const arcSize = (2 * Math.PI) / totalSectors;
let currentRotation = 0;
let isSpinning = false;

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Внешний обод
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // Сектора
    sectors.forEach((sector, i) => {
        const startAngle = i * arcSize - Math.PI/2; // Смещение на 90°
        const endAngle = startAngle + arcSize;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.fillStyle = sector.color;
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fill();

        // Текст
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.font = "bold 16px Arial";
        ctx.fillText(sector.label, radius * 0.7, 5);
        ctx.restore();
    });
}

function getRandomSector() {
    let random = Math.random() * totalWeight;
    let weightSum = 0;

    for (let i = 0; i < sectors.length; i++) {
        weightSum += sectors[i].weight;
        if (random <= weightSum) return i;
    }
    return sectors.length - 1;
}

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    resultText.textContent = '';

    const extraRotations = 5;
    const randomSector = getRandomSector();
    
    // Правильный расчет угла для стрелки справа
    const targetAngle = (randomSector * arcSize) + (arcSize / 2) - Math.PI/2;
    const totalAngle = extraRotations * 2 * Math.PI + targetAngle;

    currentRotation = totalAngle;
    canvas.style.transform = `rotate(${currentRotation}rad)`;

    setTimeout(() => {
        resultText.innerHTML = `<strong>Вы выиграли:</strong> ${sectors[randomSector].label}`;
        isSpinning = false;
    }, 4000);
}

spinBtn.addEventListener('click', spin);
drawWheel();
