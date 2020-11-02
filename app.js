const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const backdropElement = document.getElementById('backdrop');
let infoModal;

const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 120;

let x = canvas.width/2;
let y = canvas.height-30;
let dx = 5;
let dy = -5;

let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for(let column=0; column<brickColumnCount; column++) {
    bricks[column] = [];
    for(let row=0; row<brickRowCount; row++) {
        bricks[column][row] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0;
let lives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function toggleBackdrop() {
    backdropElement.classList.toggle('visible');
}

function hideInfoModal() {
    toggleBackdrop();
    document.body.removeChild(infoModal);
    document.location.reload();
}

function showInfoModal(title, text) {
    toggleBackdrop();
    infoModal = document.createElement('div');
    infoModal.classList.add('modal');
    infoModal.innerHTML = `
    <h2>${title}</h2>
    <p>${text}</p>
  `;
    const closeButton = document.createElement('button');
    closeButton.addEventListener('click', hideInfoModal);
    closeButton.textContent = 'OK';
    infoModal.appendChild(closeButton);
    document.body.appendChild(infoModal);
    document.location.stop();
}

//also included 'Right' and 'Left' checks to support IE/Edge browsers
function keyDownHandler(event) {
    if(event.key === 'Right' || event.key === 'ArrowRight') {
        rightPressed = true;
    }
    else if(event.key === 'Left' || event.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(event) {
    if(event.key === 'Right' || event.key === 'ArrowRight') {
        rightPressed = false;
    }
    else if(event.key === 'Left' || event.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
        checkPaddleLeft();
        checkPaddleRight();
    }
}

function checkBallX() {
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
}

function checkBallY() {
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (lives) {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 5;
                dy = -5;
                paddleX = (canvas.width-paddleWidth)/2;
            } else {
                showInfoModal('GAME OVER', 'Try again!');
            }
        }
    }
}

function checkPaddleRight() {
    if (paddleX + paddleWidth > canvas.width){
        paddleX = canvas.width - paddleWidth;
    }
}

function checkPaddleLeft() {
    if (paddleX < 0){
        paddleX = 0;
    }
}

function collisionDetection() {
    for(let column=0; column<brickColumnCount; column++) {
        for(let row=0; row<brickRowCount; row++) {
            let brick = bricks[column][row];
            if (brick.status === 1) {
                if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
                    dy = -dy;
                    brick.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        showInfoModal('YOU WON', `Congratulations! You have scored ${score}.`);
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#d62075";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#d62075";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let column=0; column<brickColumnCount; column++) {
        for(let row=0; row<brickRowCount; row++) {
            if(bricks[column][row].status === 1) {
                const brickX = (column*(brickWidth+brickPadding))+brickOffsetLeft;
                const brickY = (row*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#d62075";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "20px Roboto";
    ctx.fillStyle = "#d62075";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
    ctx.font = "20px Roboto";
    ctx.fillStyle = "#d62075";
    ctx.fillText(`Lives: ${lives}`, canvas.width-65, 20);
}

function movePaddle() {
    if(rightPressed) {
        paddleX += 7;
        checkPaddleRight()
    }
    else if(leftPressed) {
        paddleX -= 7;
        checkPaddleLeft()
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

    collisionDetection();
    checkBallX();
    checkBallY();
    movePaddle();
    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

draw();


