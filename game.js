let board;
let boardwidth = 360;
let boardheight = 576;
let context;

let lwidth = 100;
let lheight = 100;
let lx = boardwidth / 2 - lwidth / 2;
let ly = boardheight - lheight;
let velx = 0;
let score = 0;
let gameOver = false;

// Character object
let l = {
    img: null,
    x: lx,
    y: ly,
    width: lwidth,
    height: lheight
};

// Banana array and properties
let bananas = [];
let bananaSpeed = 3;
let bananaWidth = 50;
let bananaHeight = 50;

// Load images
window.onload = function() {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    let limg = new Image();
    limg.src = "./L.png";
    l.img = limg;

    limg.onload = function() {
        context.drawImage(l.img, l.x, l.y, l.width, l.height);
    }

    for (let i = 0; i < 5; i++) {
        spawnBanana(i * 100);  // Spawn 5 bananas spaced 100px apart initially
    }

    requestAnimationFrame(update);
    document.addEventListener('keydown', movel);
    document.getElementById("leftButton").addEventListener("touchstart", () => moveLeft());
    document.getElementById("rightButton").addEventListener("touchstart", () => moveRight());
}

function spawnBanana(offsetY = 0) {
    let banana = {
        img: new Image(),
        x: Math.random() * (boardwidth - bananaWidth),
        y: -offsetY,
        width: bananaWidth,
        height: bananaHeight
    };
    banana.img.src = "./banana.png";  // Ensure you have banana.png in the same folder
    bananas.push(banana);
}

function update() {
    if (gameOver) {
        context.fillStyle = "red";
        context.font = "30px Arial";
        context.fillText("Game Over", boardwidth / 2 - 70, boardheight / 2);
        return;
    }

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Draw and update character
    l.x += velx;
    if (l.x > boardwidth) {
        l.x = 0;
    } else if (l.x + l.width < 0) {
        l.x = boardwidth;
    }
    context.drawImage(l.img, l.x, l.y, l.width, l.height);

    // Draw and update bananas
    for (let i = 0; i < bananas.length; i++) {
        let banana = bananas[i];
        banana.y += bananaSpeed;

        if (banana.y > boardheight) {
            gameOver = true;  // Banana missed, game over
        }

        // Check collision
        if (
            banana.y + banana.height >= l.y &&
            banana.x + banana.width >= l.x &&
            banana.x <= l.x + l.width &&
            banana.y <= l.y + l.height
        ) {
            score++;  // Increment score if caught
            bananas.splice(i, 1);  // Remove banana
            spawnBanana();  // Spawn new banana
        }

        context.drawImage(banana.img, banana.x, banana.y, banana.width, banana.height);
    }

    // Draw score
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 30);
}

function movel(e) {
    if (e.code == 'ArrowRight') {
        velx = 4;
    } else if (e.code == 'ArrowLeft') {
        velx = -4;
    }
}

function moveLeft() {
    velx = -4;  // Set velocity for left movement
}

// Function for moving right when the right button is touched
function moveRight() {
    velx = 4;   // Set velocity for right movement
}

// Reset velocity to 0 when touch ends to stop character
document.getElementById("leftButton").addEventListener("touchend", () => velx = 0);
document.getElementById("rightButton").addEventListener("touchend", () => velx = 0);

