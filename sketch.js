let stars = [];
let bullets = [];
let asteroids = [];
let rocketpic;
let asteroidpic;
let lifepic;
let rocket;
let lives = 6;

function preload() {
  rocketpic = loadImage("Img/Rocket.png");
  asteroidpic = loadImage("Img/Asteroid.png");
  lifepic = loadImage("Img/Life.png");
}

function setup() {
  createCanvas(800, 400);
  //create Stars
  for (let i = 0; i < 350; i++) {
    stars[i] = new Star();
  }
  createP("Use you arrowkeys to move the rocket. Use spacebar to shoot the asteroids.");
  createP("Once an asteroid leaves the right side of your screen you lose a life.");
  //create Asteroids
  for (let i = 0; i < 15; i++) {
    asteroids[i] = new Asteroid();
  }
  //create Rocket
  rocket = new Rocket();
}

function draw() {
  background(0, 0, 80);
  //show the stars, and make new ones appear
  for (let i = 0; i < stars.length; i++) {
    stars[i].show();
    if (stars[i].edge()) {
      stars.splice(i, 1);
      remake();
    }
  }
  //show the asteroids
  for (a of asteroids) {
    push();
    a.show(asteroidpic);
    pop();
  }
  //show the rocket
  rocket.show(rocketpic);
  //delete the asteroids when it leaves the left screen
  for (let i = 0; i < asteroids.length; i++) {
    //deduct lives when asteroid reaches left end
    if (asteroids[i].x <= 0 && asteroids[i].y > 0 && asteroids[i].y < height) {
      lives -= 1;
    }
    if (asteroids[i].x <= 0) {
      asteroids.splice(i, 1);
      asteroids.push(new Asteroid);
    }
  }
  //draw lives left
  for (let i = 0; i < lives; i++) {
    image(lifepic, i * 15 + 10, 15, 15, 15);
  }
  //show the bullets, and delete them when they leave the right screen
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].show();
    if (bullets[i].x >= width + 10) {
      bullets.splice(i, 3);
    }
  }
  //delete the shot asteroid and affecting bullet
  for (let i = 0; i < asteroids.length; i++) {
    for (let j = 0; j < bullets.length; j++) {
      if (bullets[j].intersects(asteroids[i])) {
        asteroids[i].y += 1000;
        bullets.splice(j, 3);
      }
    }
  }
  //move the rocket
  if (keyIsDown(RIGHT_ARROW)) {
    rocket.move(7, 0);
  } else if (keyIsDown(LEFT_ARROW)) {
    rocket.move(-7, 0);
  } else if (keyIsDown(UP_ARROW)) {
    rocket.move(0, -9);
  } else if (keyIsDown(DOWN_ARROW)) {
    rocket.move(0, 9);
  }
  //game over
  if (lives <= 0) {
    noLoop();
    background(0);
    textAlign(CENTER);
    textSize(80);
    fill(255);
    text("Game Over", width / 2, height / 2);
  }
}

//happens when a star exits the screen
function remake() {
  stars.push(new Star(random(width + 50, width + 150)));
}

//make the rocket shoot 3 bullets
function keyPressed() {
  if (keyCode == 32) {
    for (let i = 0; i < 3; i++) {
      bullets.push(new Bullet(rocket.x - i * 10, rocket.y));
    }
  }
}


class Bullet {
  constructor(x, y) {
    this.x = x + 25;
    this.y = y + 25;
    this.xspeed = 15;
    this.r = 4;
  }
  show() {
    noStroke();
    fill(0, 135, 150);
    ellipse(this.x, this.y, this.r * 2);
    this.x += this.xspeed;
  }
  intersects(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    return (d <= this.r + other.r);
  }
}

class Asteroid {
  constructor() {
    this.r = 20;
    this.x = random(width + 30, width + 800);
    this.y = random(this.r, height - this.r);
    this.xspeed = -2;
  }
  show(pic) {
    imageMode(CENTER);
    image(pic, this.x, this.y, this.r * 2, this.r * 2);
    this.x += this.xspeed;
  }
}

class Star {
  constructor(x) {
    if (x) {
      this.x = x;
    } else {
      this.x = random(width + 50);
    }
    this.y = random(height);
    this.xspeed = random(-8, -4);
  }
  show() {
    noStroke();
    fill(100, 100, 0, 300);
    ellipse(this.x, this.y, 3);
    this.x += this.xspeed;
  }
  edge() {
    return (this.x < 0);
  }
}

class Rocket {
  constructor() {
    this.x = 10;
    this.y = height / 2;
    this.side = 50;
  }
  show(rocket) {
    image(rocket, this.x, this.y, this.side, this.side);
    this.x = constrain(this.x, 0, width - this.side);
    this.y = constrain(this.y, 2, height - this.side - 2);
  }
  move(x, y) {
    this.x += x;
    this.y += y;
  }
}