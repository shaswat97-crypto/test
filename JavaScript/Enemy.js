export default class Enemy {
    constructor(x, y, radius, color, velocity, speed) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
      this.speed = speed;
    }
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
    }
    update() {
      this.draw();
      this.x = this.x + this.velocity.x * this.speed;
      this.y = this.y + this.velocity.y * this.speed;
    }
  }