// ... (предыдущие объявления остаются без изменений)

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем внешний обод
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    sectors.forEach((sector, i) => {
        const startAngle = i * arcSize - Math.PI/2; // Смещение на 90°
        const endAngle = startAngle + arcSize;

        // Сектор
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.fillStyle = sector.color;
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fill();

        // Текст (теперь читается правильно)
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFF";
        ctx.font = "bold 16px Arial";
        ctx.fillText(sector.label, radius * 0.7, 5);
        ctx.restore();
    });
}

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    resultText.textContent = '';

    const extraRotations = 5;
    const randomSector = getRandomSector();
    // Ключевая формула для стрелки справа:
    const targetAngle = (randomSector * arcSize) + (arcSize / 2) + Math.PI;
    const totalAngle = extraRotations * 2 * Math.PI + targetAngle;

    currentRotation = totalAngle;
    canvas.style.transform = `rotate(${currentRotation}rad)`;

    setTimeout(() => {
        resultText.innerHTML = `<strong>Вы выиграли:</strong> ${sectors[randomSector].label}`;
        isSpinning = false;
    }, 4000);
}
