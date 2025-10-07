const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{x:10, y:10}];
let velocity = {x:0, y:0};
let food = {x:15, y:15};

function gameLoop() {
    update();
    draw();
}

function update() {
    const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        snake = [{x:10, y:10}];
        velocity = {x:0, y:0};
        food = {x:Math.floor(Math.random()*tileCount), y:Math.floor(Math.random()*tileCount)};
        return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = {x:Math.floor(Math.random()*tileCount), y:Math.floor(Math.random()*tileCount)};
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);
}

document.addEventListener('keydown', e => {
    switch(e.key) {
        case 'ArrowUp': if (velocity.y === 0) { velocity = {x:0, y:-1}; } break;
        case 'ArrowDown': if (velocity.y === 0) { velocity = {x:0, y:1}; } break;
        case 'ArrowLeft': if (velocity.x === 0) { velocity = {x:-1, y:0}; } break;
        case 'ArrowRight': if (velocity.x === 0) { velocity = {x:1, y:0}; } break;
    }
});

setInterval(gameLoop, 100);
