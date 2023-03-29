import Player from "./Player.js";
import Enemy from "./Enemy.js";
import Particle from "./Particle.js";
import Bullet from "./Bullet.js";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const scoreBoard = document.querySelector('#scoreCount');
const result = document.querySelector('#menu');
const finalScore = document.querySelector('#finalScore');
const startButton = document.querySelector('#startGameButton');

const c = canvas.getContext("2d");
console.log(c);

//*****CLASS FOR PLAYER******
// class Player {
//   constructor(x, y, radius, color) {
//     this.x = x;
//     this.y = y;
//     this.radius = radius;
//     this.color = color;
//   }
//   draw() {
//     c.beginPath();
//     c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     c.fillStyle = this.color;
//     c.fill();
//   }
// }

//******CLASS FOR BULLET*****
// class Bullet {
//   constructor(x, y, radius, color, velocity, speed) {
//     this.x = x;
//     this.y = y;
//     this.radius = radius;
//     this.color = color;
//     this.velocity = velocity;
//     this.speed = speed;
//   }
//   draw() {
//     c.beginPath();
//     c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     c.fillStyle = this.color;
//     c.fill();
//   }
//   update() {
//     this.draw();
//     this.x = this.x + this.velocity.x * this.speed;
//     this.y = this.y + this.velocity.y * this.speed;
//   }
// }

//*******CLASS FOR PARTICLE (work same as bullet)******
const friction = 0.97; // to reduce the speed of a particle
// class Particle {
//   constructor(x, y, radius, color, velocity, speed) {
//     this.x = x;
//     this.y = y;
//     this.radius = radius;
//     this.color = color;
//     this.velocity = velocity;
//     this.speed = speed;
//     this.alpha = 1;
//   }
//   draw() {
//     c.save();
//     c.globalAlpha = this.alpha;
//     c.beginPath();
//     c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     c.fillStyle = this.color;
//     c.fill();
//     c.restore();
//   }
//   update() {
//     this.draw();
//     this.velocity.x *= friction;
//     this.velocity.y *= friction;
//     this.x = this.x + this.velocity.x * this.speed;
//     this.y = this.y + this.velocity.y * this.speed;
//     this.alpha -= 0.01;
//   }
// }

//******CLASS FOR ENEMY*******
// class Enemy {
//   constructor(x, y, radius, color, velocity, speed) {
//     this.x = x;
//     this.y = y;
//     this.radius = radius;
//     this.color = color;
//     this.velocity = velocity;
//     this.speed = speed;
//   }
//   draw() {
//     c.beginPath();
//     c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     c.fillStyle = this.color;
//     c.fill();
//   }
//   update() {
//     this.draw();
//     this.x = this.x + this.velocity.x * this.speed;
//     this.y = this.y + this.velocity.y * this.speed;
//   }
// }

//all arrays to store respective items
let bullets = [];
let enemies = [];
let particles = [];

//count of current score
let score = 0;

//set everything to 0
function init() {
  bullets = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreBoard.innerHTML = 0;
}


function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (38 - 5) + 5;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      x = Math.random() * canvas.width;
    }
    const color = `rgb(${Math.random() * (200 - 50) + 50},${Math.random() * (200 - 50) + 50
      },${Math.random() * (200 - 50) + 50})`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    const speed = 1;

    enemies.push(new Enemy(x, y, radius, color, velocity, speed));
  }, 1000);
}

window.addEventListener("click", (event) => {
  //console.log(event);
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  //creating new bullets
  const bullet = new Bullet(
    canvas.width / 2,
    canvas.height / 2,
    5,
    "white",
    velocity,
    5
  );
  bullets.push(bullet);
  // console.log(bullets);
});
const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 10, "white");//creating new player
let animationid;

function animate() {
  animationid = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  bullets.forEach((bullet, bindex) => {
    bullet.update();
    if (
      bullet.x - bullet.radius < 0 ||
      bullet.x - bullet.radius > canvas.width ||
      bullet.y - bullet.radius < 0 ||
      bullet.y - bullet.radius > canvas.height
    ) {
      setTimeout(() => {
        bullets.splice(bindex, 1);
        // enemies.splice(eindex, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, eindex) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationid);
      menu.style.display = 'flex';
      finalScore.innerHTML = score;
      startButton.innerHTML = 'Restart Game';
    }

    bullets.forEach((bullet, bindex) => {
      const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
      if (dist - enemy.radius - bullet.radius < 1) {
        for (i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              bullet.x,
              bullet.y,
              Math.random() * 2,
              enemy.color,
              {
                x: Math.random() - 0.5,
                y: Math.random() - 0.5,
              },
              8
            )
          );
        }

        if (enemy.radius - 10 > 10) {
          score += 30;
          enemy.radius -= 10;
          setTimeout(() => {
            bullets.splice(bindex, 1);
          }, 0);
        } else {
          score += 120;
          setTimeout(() => {
            bullets.splice(bindex, 1);
            enemies.splice(eindex, 1);
          }, 0);
        }
        scoreBoard.innerHTML = score;
      }
    });
  });
}

startButton.addEventListener('click', () => {
  init();
  menu.style.display = 'none';
  spawnEnemies();
  animate();
})
