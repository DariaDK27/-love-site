// Находим холст и получаем "контекст рисования" (инструмент для рисования на canvas)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Переменные игры
let catX = 220;          // позиция кота по горизонтали
const catY = 350;        // позиция кота по вертикали (фиксированная, внизу)
const catWidth = 60;
const catHeight = 40;
const catSpeed = 8;      // на сколько пикселей двигается кот за нажатие

let score = 0;
let items = [];          // массив падающих предметов (сердечки и мячики)
let gameRunning = false;

// Слушаем нажатия клавиш и запоминаем, какая клавиша сейчас зажата
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
});

// Функция создания нового падающего предмета
function spawnItem() {
    const isHeart = Math.random() > 0.35; // 65% шанс, что это сердечко
    items.push({
        x: Math.random() * (canvas.width - 30),
        y: 0,
        size: 30,
        speed: 2 + Math.random() * 2,
        type: isHeart ? 'heart' : 'ball'
    });
}

// Обновление позиций всех предметов и кота
function update() {
    if (leftPressed) catX -= catSpeed;
    if (rightPressed) catX += catSpeed;

    // не даём коту уйти за пределы холста
    if (catX < 0) catX = 0;
    if (catX > canvas.width - catWidth) catX = canvas.width - catWidth;

    items.forEach(item => {
        item.y += item.speed;
    });

    // проверяем столкновения кота с предметами
    items.forEach(item => {
        const caught =
            item.x < catX + catWidth &&
            item.x + item.size > catX &&
            item.y < catY + catHeight &&
            item.y + item.size > catY;

        if (caught) {
            score += item.type === 'heart' ? 1 : -1;
            item.caught = true;
        }
    });

    // убираем предметы, которые поймали или улетели за нижний край экрана
    items = items.filter(item => !item.caught && item.y < canvas.height);

    document.getElementById('score').textContent = score;
}

// Отрисовка всего на холсте
function draw() {
    // очищаем холст перед новой отрисовкой кадра
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // рисуем кота (пока просто оранжевый прямоугольник с ушками)
    ctx.fillStyle = '#e08e45';
    ctx.fillRect(catX, catY, catWidth, catHeight);
    ctx.beginPath();
    ctx.moveTo(catX + 5, catY);
    ctx.lineTo(catX + 15, catY - 15);
    ctx.lineTo(catX + 25, catY);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(catX + 35, catY);
    ctx.lineTo(catX + 45, catY - 15);
    ctx.lineTo(catX + 55, catY);
    ctx.fill();

    // рисуем падающие предметы
    items.forEach(item => {
        ctx.font = item.size + 'px Arial';
        ctx.fillText(item.type === 'heart' ? '❤️' : '🎾', item.x, item.y + item.size);
    });
}

// Главный игровой цикл — вызывается снова и снова через requestAnimationFrame
function gameLoop() {
    if (!gameRunning) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Таймер, который каждые 900мс создаёт новый падающий предмет
let spawnInterval;

function startGame() {
    score = 0;
    items = [];
    catX = 220;
    gameRunning = true;

    clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnItem, 900);

    gameLoop();
}