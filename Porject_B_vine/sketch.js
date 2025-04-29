let vines = []

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  for (let i = -2; i <= 2; i++) { 
    vines.push(new Vine(width/2 + i * 60, i))
  }
}

function draw() {
  background(20)

  for (let i = 0; i < vines.length; i++) {
    vines[i].update()
    vines[i].display()
  }
}

class Vine {
  constructor(baseX, index) {
    this.baseX = baseX
    this.index = index
    this.len = 300
    this.shrinking = false;
  }

  update() {
    if (dist(mouseX, mouseY, this.baseX, height - this.len) < 100) {
      this.shrinking = true
    }

    if (this.shrinking && this.len > 0) {
      this.len -= 4
    }
  }

  display() {
    stroke(55, 69, 24)
    strokeWeight(6)
    noFill()
    
    beginShape()
    for (let y = 0; y < this.len; y += 5) {
      let angle = y * 0.07
      let wave = sin(angle) * 10
      let inwardShift = this.index * map(y, 0, 300, -30, 30)
      vertex(this.baseX + wave + inwardShift, height - y)
    }
    endShape()
  }
}