let score = 0;
let lives = 3;
const alienRows = 5;
const aliensPerRow = 2;
const alienWidth = 40;
const alienHeight = 40;
const alienPadding = 10;
const alienOffsetTop = 50;
const alienOffsetLeft = 50;
let alienSpeed = 1; // Initial alien speed

let aliens = [];
let playerX = 275; // Initial player position
const playerWidth = 50;
const playerHeight = 20;
const playerSpeed = 5;

const bulletWidth = 4;
const bulletHeight = 10;
let bullets = [];

const bombWidth = 6;
const bombHeight = 10;
let bombs = [];

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Info bar elements
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

// Initialize game
function init() {
  scoreElement.textContent = `Score: ${score}`;
  livesElement.textContent = `Lives: ${lives}`;
  createAliens();
  gameLoop();
  setInterval(dropBomb, 1000); // Drop bombs every 1 second
}

// Create aliens
function createAliens() {
  for (let row = 0; row < alienRows; row++) {
    aliens[row] = [];
    for (let col = 0; col < aliensPerRow; col++) {
      let x = col * (alienWidth + alienPadding) + alienOffsetLeft;
      let y = row * (alienHeight + alienPadding) + alienOffsetTop;
      aliens[row][col] = { x: x, y: y, alive: true };
    }
  }
}

// Draw aliens
function drawAliens() {
  for (let row = 0; row < alienRows; row++) {
    for (let col = 0; col < aliensPerRow; col++) {
      if (aliens[row][col].alive) {
        ctx.beginPath();
        ctx.rect(
          aliens[row][col].x,
          aliens[row][col].y,
          alienWidth,
          alienHeight
        );
        ctx.fillStyle = "#00ff00";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Draw player
function drawPlayer() {
  ctx.beginPath();
  ctx.rect(
    playerX,
    canvas.height - playerHeight - 10,
    playerWidth,
    playerHeight
  );
  ctx.fillStyle = "#00ff00";
  ctx.fill();
  ctx.closePath();
}

// Update bullets
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= 5; // Bullet speed
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }
}

// Draw bullets
function drawBullets() {
  for (let i = 0; i < bullets.length; i++) {
    ctx.beginPath();
    ctx.rect(bullets[i].x, bullets[i].y, bulletWidth, bulletHeight);
    ctx.fillStyle = "#00ff00";
    ctx.fill();
    ctx.closePath();
  }
}

// Update bombs
function updateBombs() {
  for (let i = bombs.length - 1; i >= 0; i--) {
    bombs[i].y += 3; // Bomb speed
    if (bombs[i].y > canvas.height) {
      bombs.splice(i, 1);
    }
  }
}

// Draw bombs
function drawBombs() {
  for (let i = 0; i < bombs.length; i++) {
    ctx.beginPath();
    ctx.rect(bombs[i].x, bombs[i].y, bombWidth, bombHeight);
    ctx.fillStyle = "#ff0000";
    ctx.fill();
    ctx.closePath();
  }
}

// Drop bombs randomly from aliens
function dropBomb() {
  let aliveAliens = [];
  for (let row = 0; row < alienRows; row++) {
    for (let col = 0; col < aliensPerRow; col++) {
      if (aliens[row][col].alive) {
        aliveAliens.push(aliens[row][col]);
      }
    }
  }

  if (aliveAliens.length > 0) {
    let randomAlien =
      aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
    bombs.push({
      x: randomAlien.x + alienWidth / 2 - bombWidth / 2,
      y: randomAlien.y + alienHeight,
    });
  }
}

// Collision detection
function collisionDetection() {
  // Player bullet vs aliens
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let row = 0; row < alienRows; row++) {
      for (let col = 0; col < aliensPerRow; col++) {
        if (aliens[row][col].alive) {
          let alien = aliens[row][col];
          if (
            bullets[i] &&
            bullets[i].x > alien.x &&
            bullets[i].x < alien.x + alienWidth &&
            bullets[i].y > alien.y &&
            bullets[i].y < alien.y + alienHeight
          ) {
            bullets.splice(i, 1);
            aliens[row][col].alive = false;
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
          }
        }
      }
    }
  }

  // Alien bomb vs player
  for (let i = bombs.length - 1; i >= 0; i--) {
    if (
      bombs[i].x > playerX &&
      bombs[i].x < playerX + playerWidth &&
      bombs[i].y > canvas.height - playerHeight - 10 &&
      bombs[i].y < canvas.height - 10
    ) {
      bombs.splice(i, 1);
      lives--;
      livesElement.textContent = `Lives: ${lives}`;
      if (lives === 0) {
        gameOver();
      }
    }
  }

  // Detect if any aliens have reached the bottom
  for (let row = 0; row < alienRows; row++) {
    for (let col = 0; col < aliensPerRow; col++) {
      if (
        aliens[row][col].alive &&
        aliens[row][col].y + alienHeight >= canvas.height - playerHeight - 10
      ) {
        gameOver();
      }
    }
  }
}

// Game over function
function gameOver() {
  alert("Game Over");
  document.location.reload();
}

// Keyboard event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  } else if (e.key === " ") {
    bullets.push({
      x: playerX + playerWidth / 2 - bulletWidth / 2,
      y: canvas.height - playerHeight - bulletHeight - 10,
    });
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// Update player position
function updatePlayerPosition() {
  if (rightPressed && playerX < canvas.width - playerWidth) {
    playerX += playerSpeed;
  } else if (leftPressed && playerX > 0) {
    playerX -= playerSpeed;
  }
}

// Update alien position
function updateAlienPosition() {
  for (let row = 0; row < alienRows; row++) {
    for (let col = 0; col < aliensPerRow; col++) {
      if (aliens[row][col].alive) {
        aliens[row][col].x += alienSpeed;
      }
    }
  }
  for (let row = 0; row < alienRows; row++) {
    for (let col = 0; col < aliensPerRow; col++) {
      if (
        aliens[row][col].alive &&
        (aliens[row][col].x + alienWidth > canvas.width ||
          aliens[row][col].x < 0)
      ) {
        alienSpeed = -alienSpeed;
        for (let r = 0; r < alienRows; r++) {
          for (let c = 0; c < aliensPerRow; c++) {
            aliens[r][c].y += 10; // Move aliens down
          }
        }
        break; // Break the inner loop to avoid multiple speed changes
      }
    }
  }
}

// Update game state
function updateGameState() {
  updatePlayerPosition();
  updateBullets();
  updateBombs();
  collisionDetection();
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAliens();
  drawPlayer();
  drawBullets();
  drawBombs();
  updateAlienPosition();
  updateGameState();
  requestAnimationFrame(gameLoop);
}

// Start the game
init();
