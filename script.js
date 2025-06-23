const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultText = document.getElementById('result');

const sectors = [
    { color: '#FF5252', label: 'Приз 1', weight: 5 },
    { color: '#FFEB3B', label: 'Приз 2', weight: 1 },
    { color: '#4CAF50', label: 'Приз 3', weight: 3 },
    { color: '#2196F3', label: 'Приз 4', weight: 2 },
    { color: '#9C27B0', label: 'Приз 5', weight: 4 },
    { color: '#FF9800', label: 'Приз 6', weight: 1 },
];

const totalSectors = sectors.length;
const arcSize = (2 * Math.PI) / totalSectors;
let currentRotation = 0;
let isSpinning = false;

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
        ctx.fillStyle = sector.color;
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(sector.label, radius - 10, 5);
        ctx.restore();
    });
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

function spin() {
    if (isSpinning) return;

    isSpinning = true;
    resultText.textContent = '';

    const selectedIndex = getRandomSectorIndex();
    const sectorAngle = arcSize;

    const extraRotations = 5;
    const pointerAngle = 0; // стрелка справа по центру круга
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
