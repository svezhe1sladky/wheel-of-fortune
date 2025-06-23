const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultText = document.getElementById('result');

// Настройка размера canvas
function resizeCanvas() {
    const size = Math.min(500, window.innerWidth - 40);
    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Сектора колеса (можно менять количество и названия)
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
    const radius = canvas.width / 2 - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Внешний обод
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // Сектора
    sectors.forEach((sector, i) => {
        const startAngle = i * arcSize - Math.PI/2;
        const endAngle = startAngle + arcSize;

        // Рисуем сектор
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.fillStyle = sector.color;
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fill();

        // Добавляем разделительные линии
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + radius * Math.cos(startAngle),
            centerY + radius * Math.sin(startAngle)
        );
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.stroke();

        // Текст
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFF";
        ctx.font = "bold " + Math.max(14, radius/10) + "px Arial";
        ctx.fillText(sector.label, radius * 0.65, 5);
        ctx.restore();
    });
}

function getRandomSector() {
    const random = Math.random() * totalWeight;
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
    spinBtn.disabled = true;
    resultText.textContent = "Крутим...";
    resultText.classList.remove("win-message");

    const extraRotations = 5;
    const randomSector = getRandomSector();
    
    // Расчет угла для остановки напротив стрелки
    const targetAngle = (randomSector * arcSize) + (arcSize / 2) + Math.PI;
    const totalAngle = extraRotations * 2 * Math.PI + targetAngle;

    currentRotation = totalAngle;
    canvas.style.transform = `rotate(${currentRotation}rad)`;

    setTimeout(() => {
        resultText.innerHTML = `🎉 <strong>Поздравляем!</strong> Вы выиграли: <span class="win-text">${sectors[randomSector].label}</span> 🎉`;
        resultText.classList.add("win-message");
        isSpinning = false;
        spinBtn.disabled = false;
    }, 4000);
}

spinBtn.addEventListener('click', spin);
drawWheel();
