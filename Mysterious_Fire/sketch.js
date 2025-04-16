let fires = []
let numFire = 100

function setup() {
  createCanvas(800, 500).parent("p5-canvas-container")
  colorMode(HSB)
  background(0, 0, 15)
}

function draw() {
  background(0, 0, 15, 35)

  if (mouseIsPressed) {
    for (let i = 0; i < 6; i++) {
      fires.push(new Fire(mouseX, mouseY))
    }
  }

  for (let f of fires) {
    f.update()
    f.display()
  }

  fires = fires.filter(f => f.onCanvas)
}

class Fire {
  constructor(x, y) {
    this.ox = x
    this.x = x
    this.y = y
    this.size = random(15, 24)
    this.hue = random(0, 40)
    this.age = 0

    this.lifespan = random(1) < 0.9 ? random(12, 25) : random(35, 70)
    this.angle = random([-1, 1]) * random(0.4, 1)
    this.spread = random(30, 70)
    this.velY = random(-3, -5)

    this.onCanvas = true
  }

  update() {
    let t = this.age / this.lifespan

    if (t < 0.3) {
      this.x = this.ox + this.angle * t * this.spread
    } else {
      let back = (1 - t) * this.spread * 0.4
      this.x = this.ox + this.angle * back + random(-0.3, 0.3)
    }

    this.y += this.velY + random(-0.2, 0.2)
    this.velY *= 0.97
    this.age++

    if (this.age > this.lifespan || this.y < -100) {
      this.onCanvas = false
    }
  }

  display() {
    push();
    translate(this.x, this.y)
    let mid = 0
    for (let y = -this.size / 2; y <= this.size / 2; y++) {
      let waveX = 4.5 * sin(y * 0.25 + frameCount * 0.15)
      let d = abs(y - mid)
      let r = map(d, 0, this.size / 2, this.size, 0.5)
      let alpha = map(this.age, 0, this.lifespan, 255, 0)
      fill(this.hue, 255, 255, alpha)
      noStroke()
      ellipse(waveX, y, r, r)
    }
    pop()
  }
}

function mousePressed() {
  for (let i = 0; i < numFire; i++) {
    fires.push(new Fire(mouseX, mouseY))
  }
}