let knobAngle = 0
let knobRadius = 20
let knobCenterX = 550
let knobCenterY = 380
let knobSize = 6
let rotatingLeft = false
let rotatingRight = false
let glow = 0

let dialX = 300
let dialMin = 212
let dialMax = 588
let lastKnobAngle = 0
let lastDirection = 0
let rotationCount = 0

let radioX = 400
let radioY = 350
let radioAngle = 0
let boxAngle = 0
let antennaAngle = 0
let movementTime = 0
let radioShaking = false

let keepOutY = 170
let keepOutFalling = false

let signX = 320
let signMoving = false
let signDirection = 1

let resetCounter = 0
let resetTriggered = false

//moment change 

function setup() {
  createCanvas(800, 450)
  let canvas = createCanvas(800, 450);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
}

function draw() {
  background(20)
  glow += 0.05

  // Draw the room and tables
  drawWallsAndCeiling()
  drawPipesAndWires()
  drawLeftTable()
  drawRightTable()
  drawMiddleTable()
  drawWarningSigns()

  // Update the knob and dial
  updateKnob()

  // Draw the radio
  push()
  translate(radioX, radioY)
  rotate(boxAngle)
  drawRadiomainbody()
  drawAntenna()
  drawTurningKnob()
  drawMovingdial()
  drawSignalButton()
  pop()

  // Draw the radio signal
  drawRadioSignal()

  // Draw the "KEEP OUT" sign
  drawKeepOutSign()

  // Update falling elements
  updateFallingElements()

  // Animate the radio if it's shaking
  if (radioShaking) {
    animateRadioBox()
  }

  // Move the warning sign back and forth
  if (signMoving) {
    signX += signDirection * 5
    if (signX > 280 || signX < 220) {
      signDirection *= -1
    }
  }

  // Reset the scene after a while
  if (radioShaking) {
    if (!resetTriggered) {
      resetCounter++
      if (resetCounter >= 600) {
        resetScene()
        resetTriggered = true
      }
    }
  }
}

function resetScene() {
  knobAngle = 0
  rotatingLeft = false
  rotatingRight = false
  dialX = 300
  lastKnobAngle = 0
  lastDirection = 0
  rotationCount = 0
  radioShaking = false
  keepOutY = 170
  keepOutFalling = false
  signX = 320
  signMoving = false
  signDirection = 1
  resetCounter = 0
  resetTriggered = false
  radioAngle = 0
  boxAngle = 0
  antennaAngle = 0
  movementTime = 0
}

function drawRadioSignal() {
  push()
  stroke(255, 0, 0)
  strokeWeight(2)
  noFill()

  beginShape()
  for (let x = 0; x < width; x += 5) {
    let y = 150

    // Make the signal wave based on the dial position
    if (dialX > 250 && dialX < 350) {
      let wave = sin((x + frameCount) * 0.1) * 20
      y += wave
    } else if (dialX > 400 && dialX < 500) {
      // No wave here
    } else {
      let wave = sin((x + frameCount) * 0.05) * 10
      y += wave
    }

    // Add noise if the radio is shaking
    if (radioShaking) {
      let noiseVal = noise(x * 0.01, frameCount * 0.1) * 50
      y += noiseVal - 25
    }

    vertex(x, y)
  }
  endShape()
  pop()
}

function updateKnob() {
  // Rotate the knob
  if (rotatingLeft) knobAngle -= 0.05
  if (rotatingRight) knobAngle += 0.05

  // Update the dial position based on the knob angle
  let knobDirection = knobAngle > lastKnobAngle ? 1 : -1
  if (knobDirection !== lastDirection) {
    if (knobDirection === 1) {
      dialX = dialMin
    } else {
      dialX = dialMax
    }
  } else {
    let mappedDialX = map(knobAngle, -PI, PI, dialMin, dialMax)
    dialX = constrain(mappedDialX, dialMin, dialMax)
  }

  // Count rotations to trigger radio shaking
  if (rotatingRight) {
    rotationCount++
  }

  if (rotationCount > 250) {
    radioShaking = true
  }

  lastKnobAngle = knobAngle
  lastDirection = knobDirection
}

function animateRadioBox() {
  // Animate the radio box, antenna, and angle
  movementTime += 0.05
  radioAngle = sin(movementTime) * PI / 6
  boxAngle = sin(movementTime * 1.3) * PI / 9
  antennaAngle = sin(movementTime * 1.8) * PI / 12
}

function drawRadiomainbody() {
  // Draw the main body of the radio
  push()
  noStroke()
  fill(170, 156, 141)
  translate(-200, -90)
  rect(0, 0, 400, 180, 5)
  pop()

  push()
  stroke("black")
  fill("white")
  translate(-190, -80)
  rect(0, 0, 380, 40, 5)
  pop()

  for (let x = 220; x <= 580; x += 20) {
    push()
    translate(x - radioX, 280 - radioY)
    stroke("black")
    line(0, 0, 0, 10)
    pop()
  }

  push()
  stroke("black")
  translate(400 - radioX, 280 - radioY)
  line(-190, 0, 190, 0)
  pop()

  push()
  fill(181, 142, 98)
  translate(510 - radioX, 410 - radioY)
  rect(-200, -90, 180, 110, 5)
  pop()

  for (let y = 325; y <= 430; y += 6) {
    push()
    translate(310 - radioX, y - radioY)
    stroke("black")
    line(0, 0, 180, 0)
    pop()
  }

  // Draw the radio's side panels
  push()
  translate(radioX, radioY)
  rotate(boxAngle)
  fill(0)
  translate(215 - radioX, 325 - radioY)
  rect(0, 0, 30, 100)
  pop()

  push()
  translate(radioX, radioY)
  rotate(boxAngle)
  fill(59, 59, 59)
  translate(223 - radioX, 335 - radioY)
  rect(0, 0, 15, 85)
  pop()

  push()
  translate(radioX, radioY)
  rotate(boxAngle)
  fill(59, 59, 59)
  translate(223 - radioX, 380 - radioY)
  rect(0, 0, 15, 45)
  pop()
}

function drawAntenna() {
  // Draw the radio antenna
  push()
  translate(190, -90)
  rotate(antennaAngle)
  stroke(220)
  strokeWeight(6)
  line(0, 0, -400, -20)
  pop()
}

function drawTurningKnob() {
  // Draw the turning knob
  push()
  translate(545 - radioX, 380 - radioY)
  noFill()
  stroke(0)
  strokeWeight(2)
  ellipse(0, 0, 60)

  let knobX = cos(knobAngle) * knobRadius
  let knobY = sin(knobAngle) * knobRadius
  push()
  translate(knobX, knobY)
  fill(255)
  noStroke()
  circle(0, 0, knobSize * 2)
  pop()

  push()
  translate(-30, 40)
  fill(0)
  noStroke()
  triangle(-5, 0, 5, -5, 5, 5)
  pop()

  push()
  translate(30, 40)
  fill(0)
  noStroke()
  triangle(5, 0, -5, -5, -5, 5)
  pop()

  pop()
}

function drawSignalButton() {
  // Draw the signal button
  push()
  translate(260 - radioX, 380 - radioY)
  fill("gray")
  rect(0, 0, 30, 45)

  fill("red")
  rect(0, -50, 30, 45)
  pop()

  push()
  fill("black")
  rect(-185, -20, 30, 95)
  pop()
}

function drawMovingdial() {
  // Draw the moving dial
  push()
  translate(dialX - radioX, 272 - radioY)
  stroke("red")
  line(0, 0, 0, 36)
  pop()
}

function drawKeepOutSign() {
  // Draw the "KEEP OUT" sign
  push()
  fill(150, 130, 0)
  translate(650, keepOutY)
  rect(0, 0, 100, 40)

  fill(90)
  textSize(16)
  textAlign(CENTER, CENTER)
  text("KEEP OUT", 50, 20)
  pop()
}

function updateFallingElements() {
  // Make the "KEEP OUT" sign fall
  if (keepOutFalling && keepOutY < height - 50) {
    keepOutY += 12
  }
}

function keyPressed() {
  // Handle key presses for rotating the knob
  if (keyCode === LEFT_ARROW) {
    rotatingLeft = true
  } else if (keyCode === RIGHT_ARROW) {
    rotatingRight = true
  }
}

function keyReleased() {
  // Handle key releases for rotating the knob
  if (keyCode === LEFT_ARROW) {
    rotatingLeft = false
  } else if (keyCode === RIGHT_ARROW) {
    rotatingRight = false
  }
}

function mousePressed() {
  // Handle mouse clicks for the buttons
  if (mouseX > 260 && mouseX < 290 && mouseY > 380 && mouseY < 425) {
    keepOutFalling = true
  }
  if (mouseX > 260 && mouseX < 290 && mouseY > 330 && mouseY < 375) {
    signMoving = !signMoving
  }
}

function drawWallsAndCeiling() {
  // Draw the walls and ceiling
  for (let y = 0; y < height - 70; y++) {
    let c = lerpColor(color(25), color(90), y / (height - 70))
    stroke(c)
    line(0, y, width, y)
  }
  fill(40)
  rect(0, 0, width, 50)
}

function drawPipesAndWires() {
  // Draw the pipes and wires on the ceiling
  stroke(90)
  strokeWeight(8)
  line(30, 40, 320, 40)
  line(500, 40, 780, 40)

  strokeWeight(5)
  line(20, 50, 300, 50)
  line(520, 50, 780, 50)

  strokeWeight(3)
  line(150, 60, 260, 60)
  line(600, 60, 750, 60)

  strokeWeight(6)
  line(400, 40, 400, 70)
  line(620, 40, 620, 80)

  stroke(80)
  strokeWeight(2)
  line(100, 50, 100, 140)
  line(200, 50, 200, 160)
  line(350, 50, 340, 150)
  line(500, 50, 510, 180)
  line(650, 50, 645, 140)

  noFill()
  beginShape()
  vertex(250, 50)
  vertex(260, 80)
  vertex(270, 60)
  vertex(280, 90)
  vertex(290, 50)
  endShape()

  beginShape()
  vertex(700, 50)
  vertex(710, 85)
  vertex(720, 55)
  vertex(730, 95)
  vertex(740, 50)
  endShape()
}

function drawLeftTable() {
  // Draw the left table
  fill(70)
  rect(50, 300, 200, 60)

  fill(50)
  rect(60, 360, 10, 30)
  rect(230, 360, 10, 30)

  fill(50)
  rect(100, 260, 80, 50)
  fill(0, 200, 0, 200 * sin(glow))
  rect(105, 265, 70, 35)

  fill(50)
  rect(110, 310, 60, 25)
}

function drawRightTable() {
  // Draw the right table
  fill(70)
  push()
  translate(550, 340)
  rotate(radians(-10))
  rect(0, 0, 200, 60)
  pop()

  fill(50)
  push()
  translate(560, 380)
  rotate(radians(-10))
  rect(0, 0, 10, 30)
  pop()

  rect(730, 360, 10, 30)

  fill(30)
  push()
  translate(600, 390)
  rotate(radians(-20))
  rect(0, 0, 80, 50)
  pop()

  fill(50)
  push()
  translate(620, 410)
  rotate(radians(-10))
  rect(0, 0, 60, 20)
  pop()
}

function drawMiddleTable() {
  // Draw the middle table
  push()
  fill(154, 155, 158)
  translate(400, 390)
  rect(-250, 0, 500, 100)
  pop()

  push()
  noStroke()
  fill(20, 20, 20)
  translate(395, 480)
  rect(-200, 90, 410, 70)
  pop()
}

function drawWarningSigns() {
  // Draw the warning signs
  push()
  translate(signX, 110)
  rotate(radians(-10))

  let glowVal = sin(glow) * 100
  let glowColor = color(200 + glowVal, 100 + glowVal * 0.5, 50 + glowVal * 0.3)
  fill(glowColor)
  rect(-5, -5, 210, 60)

  fill(60)
  rect(0, 0, 200, 50)
  fill(100)
  textSize(18)
  textAlign(CENTER, CENTER)
  text("PROJECT OZIRITH", 100, 25)
  pop()

  let signGlow = sin(glow) * 80 + 100
  fill(signGlow, signGlow * 0.8, 0)
  rect(60, 150, 100, 40)

  fill(150, 130, 0)

  fill(90)
  textSize(16)
  textAlign(CENTER, CENTER)
  text("DANGER", 110, 170)
}