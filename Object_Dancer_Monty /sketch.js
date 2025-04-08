/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new MontyDancer(width / 2, height / 2)
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class MontyDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.timer = 0
    this.bodyOffset = 0
    this.jump = 0
    this.jumping = false
    

  }
  update() {
    this.timer++
    this.bodyOffset = sin(this.timer * 0.12) * 5

    if (!this.jumping && this.timer > 120) {
      this.jumping = true
      this.jump = -8
    }

    if (this.jumping) {
      this.y += this.jump
      this.jump += 1

      if (this.y >= height / 2) {
        this.y = height / 2
        this.jumping = false
        this.timer = 0
      }
    }
  }

  display() {
    push()
    translate(this.x, this.y)
    noStroke()

    //body movement
    push()
    rotate(this.bodyOffset * 0.02)
    translate(0, -30)

    //tail
    fill(239, 108, 0)
    if (this.bodyOffset > 0) {
      ellipse(-45, 90, 60, 10)
    } else {
      ellipse(45, 90, 60, 10)
    }

    //main body 
    fill(255, 171, 64)
    beginShape()
    vertex(-35, 20)
    vertex(35, 20)
    vertex(50, 100)
    vertex(-50, 100)
    endShape(CLOSE)

    //feet
    ellipse(-15, 105, 25, 15)
    ellipse(15, 105, 25, 15)

    pop()
  

    //head
    fill(255, 171, 64)
    ellipse(0, -50, 100, 90)

    //ears
    fill(255, 171, 64)
    triangle(-35, -80, -20, -120, -5, -80)
    triangle(35, -80, 20, -120, 5, -80)

    //black ears
    fill("black");
    triangle(-25, -85, -18, -105, -10, -85)
    triangle(25, -85, 18, -105, 10, -85)

    //eyes
    fill("white");
    ellipse(-20, -50, 20, 10)
    ellipse(20, -50, 20, 10)
    fill("black")
    ellipse(-20, -50, 8, 6)
    ellipse(20, -50, 8, 6)

    //nose
    fill("black")
    triangle(-5, -40, 5, -40, 0, -35)

    //smile
    stroke(0)
    strokeWeight(2)
    noFill()
    arc(0, -32, 40, 25, radians(20), radians(160))
    noStroke()

    //arms
    push()
    rotate(this.bodyOffset * 0.02)
    translate(0, -30)
    stroke(0)
    fill(239, 108, 0)
    if (!this.jumping) {
      rect(-30, 20, 10, 40, 5)
      rect(20, 20, 10, 40, 5)
    } else {
      rect(-30, -15, 10, 40, 5)
      rect(20, -15, 10, 40, 5)
    }
    pop()
    pop()

    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
  //   this.drawReferenceShapes()

  //   pop();
  // }
  // drawReferenceShapes() {
  //   noFill();
  //   stroke(255, 0, 0);
  //   line(-5, 0, 5, 0);
  //   line(0, -5, 0, 5);
  //   stroke(255);
  //   rect(-100, -100, 200, 200);
  //   fill(255);
  //   stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/