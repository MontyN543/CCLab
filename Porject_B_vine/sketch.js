let scene = 0

// stars on start
let launchStars = []

let glacier, ocean, buildingManager
let mountainShape = []
let vines = []
let plants = []
let mountainRestored = false
let vineFullyRetracted = false
let vineRegrowTimer = 0

// year and click order
let clickStage = 0        // 0 none 1 iceberg 2 city 3 mountain
let sequenceComplete = false

let icebergActive = false
let cityActive     = false
let mountainActive = false

let yearDisplay = 2050
let targetYear  = 2050

// sky color
let pollutedColor, clearColor, skyCol

function setup() {
  let canvas = createCanvas(800, 600)
  canvas.parent("p5-canvas-container")
  noCursor()  

  // multiple stars
  for (let i = 0; i < 300; i++) {
    launchStars.push({
      x: random(width),
      y: random(height),
      r: random(2, 4.5)
    })
  }

  // sky color
  pollutedColor = color(80, 70, 60)
  clearColor    = color(135, 206, 235)
  skyCol        = pollutedColor

 // main secitons
  glacier         = new Glacier()
  ocean           = new Ocean()
  buildingManager = new BuildingManager()

  // mountian body 
  mountainShape = [
    createVector(0,   360),
    createVector(80,  320),
    createVector(180, 260),
    createVector(300, 280),
    createVector(400, 240),
    createVector(500, 360)
  ]

  // vines
  for (let i = 0; i < 28; i++) {
    let baseX = map(i, 0, 27, 0, 500)
    let angle = baseX < 80  ? radians(30)
               : baseX > 420 ? radians(-30)
               : 0
    vines.push(new Vine(baseX, angle))
  }

  generatePlants()
}

function draw() {
  // 1st scene
  if (scene === 0) {
    background(0)
    noStroke()
    fill(255)
    for (let s of launchStars) {
      circle(s.x, s.y, s.r * 2)
    }

    // gray helmet ring
    noFill()
    stroke(200)
    strokeWeight(150)
    ellipse(width/2, height/2, 880, 800)

    // earth and land 
    push()
      translate(width/2, height/2)
      noStroke()
      fill(30, 80, 150)
      circle(0, 0, 120)
      fill(80, 120, 40)
      beginShape()
        vertex(-30, -30); vertex(-10, -50); vertex(10, -40)
        vertex(15, -20); vertex(-5, -10); vertex(-25, -20)
      endShape(CLOSE)
      beginShape()
        vertex(20, -35); vertex(40, -30); vertex(50, -15)
        vertex(35, -5);  vertex(25, -20)
      endShape(CLOSE)
      beginShape()
        vertex(35, 0); vertex(50, 5); vertex(55, 20)
        vertex(40, 25); vertex(30, 10)
      endShape(CLOSE)
      beginShape()
        vertex(0, 30); vertex(15, 45); vertex(0, 55)
        vertex(-15, 45); vertex(-5, 30)
      endShape(CLOSE)
      beginShape()
        vertex(-35, 10); vertex(-45, 20); vertex(-40, 35)
        vertex(-30, 30); vertex(-25, 15)
      endShape(CLOSE)
      beginShape()
        vertex(-50, -5); vertex(-60, 5);  vertex(-55, 20)
        vertex(-40, 18); vertex(-35, 0)
      endShape(CLOSE)
    pop()

    drawCrosshair()
    return
  }

  // main landscape
  let goal = (sequenceComplete || icebergActive || cityActive || mountainActive)
             ? clearColor
             : pollutedColor
  skyCol = lerpColor(skyCol, goal, 0.01)
  background(skyCol)

  // mountian
  push()
    translate(260, 60)
    drawMountain()
    if (mountainRestored) plants.forEach(p => p.display())
    let allRetracted = true
    vines.forEach(v => {
      v.update()
      v.display()
      if (v.retractAmount < 0.98) allRetracted = false
    })
    if (mountainRestored && allRetracted && !sequenceComplete) {
      if (!vineFullyRetracted) {
        vineFullyRetracted = true
        vineRegrowTimer = millis()
      } else if (millis() - vineRegrowTimer > 2000) {
        mountainRestored = false
        vines.forEach(v => v.startRetract(false))
        vineFullyRetracted = false
      }
    }
  pop()

  // land, ocean, glacier, city
  push()
    translate(80, 60)
    drawLand()
    ocean.update(glacier.isReforming); ocean.draw()
    glacier.update(); glacier.draw()
    buildingManager.update(); buildingManager.draw()
  pop()

  // helmet
  noFill()
  stroke(200)
  strokeWeight(150)
  ellipse(width/2, height/2, 880, 800)

  // year changing
  if      (clickStage >= 3) targetYear = 2025
  else if (clickStage >= 2) targetYear = 2030
  else if (clickStage >= 1) targetYear = 2040
  else                       targetYear = 2050

  yearDisplay = lerp(yearDisplay, targetYear, 0.02)

  // year counter display
  noStroke()
  fill(0, 120, 255)
  textSize(24)
  textAlign(CENTER, TOP)
  text(floor(yearDisplay), width/2, 10)

  drawCrosshair()
}

function mousePressed() {
  if (scene === 0) {
    if (dist(mouseX, mouseY, width/2, height/2) < 60) {
      scene = 1
    }
    return
  }

  let x = mouseX, y = mouseY

  // iceberg
  if (x>560 && x<800 && y>260 && y<500) {
    glacier.reformOnce(); icebergActive = true
    setTimeout(() => icebergActive = false, 500)
    if (clickStage === 0) clickStage = 1
  }

  // city
  if (x>80 && x<300 && y>140 && y<660) {
    buildingManager.reformOnce(); cityActive = true
    setTimeout(() => cityActive = false, 600)
    if (clickStage === 1) clickStage = 2
  }

  // mountain
  if (x>260 && x<500 && y>240 && y<420) {
    mountainRestored = true
    vines.forEach(v => v.startRetract(true))
    mountainActive = true
    setTimeout(() => mountainActive = false, 2700)
    if (clickStage === 2) {
      clickStage = 3
      sequenceComplete = true
    }
  }
}

// cross hair fro gun
function drawCrosshair() {
  stroke(255)
  strokeWeight(2)
  line(mouseX-15, mouseY, mouseX+15, mouseY)
  line(mouseX, mouseY-15, mouseX, mouseY+15)
}

function drawMountain() {
  fill(50, 120, 50)
  noStroke()
  beginShape()
    mountainShape.forEach(pt => vertex(pt.x, pt.y))
    vertex(0, 360)
  endShape(CLOSE)
}

function drawLand() {
  fill(40)
  noStroke()
  rect(-80, 360, width+80, height-360)
}

function insideMountain(x, y) {
  let inside = false
  for (let i = 0, j = mountainShape.length - 1; i < mountainShape.length; j = i++) {
    let xi = mountainShape[i].x, yi = mountainShape[i].y
    let xj = mountainShape[j].x, yj = mountainShape[j].y
    let intersect = ((yi > y) !== (yj > y))
                 && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

function generatePlants() {
  plants = []
  while (plants.length < 120) {
    let x = random(10, 500), y = random(260, 360)
    if (insideMountain(x, y)) plants.push(new Plant(x, y))
  }
}

class Particle {
  constructor(x, y, isCore) {
    this.originalX = x
    this.originalY = y
    this.x = x
    this.y = isCore ? y : height - random(0, 40)
    this.isCore = isCore
    this.speedY = random(1, 2)
    this.meltDelay = map(y, 200, 440, 0, 100)
    this.reformDelay = map(y, 440, 200, 0, 100)
    this.meltCounter = 0
    this.reformCounter = 0
  }
  melt() {
    this.meltCounter++
    if (!this.isCore && this.meltCounter > this.meltDelay) {
      if (this.y < height - 63) {
        this.y += this.speedY
        this.x += random(-0.3, 0.3)
      } else {
        this.y = height - 63
      }
    }
  }
  reform() {
    this.reformCounter++
    if (this.reformCounter > this.reformDelay || this.isCore) {
      this.x = lerp(this.x, this.originalX, 0.1)
      this.y = lerp(this.y, this.originalY, 0.1)
    }
  }
  isFullyReformed() {
    return abs(this.x - this.originalX) < 0.5
        && abs(this.y - this.originalY) < 0.5
  }
  display(r) {
    fill(180, 220, 255)
    noStroke()
    circle(this.x, this.y, r)
  }
  resetCounters() {
    this.meltCounter = 0
    this.reformCounter = 0
  }
}

class Ocean {
  constructor() {
    this.particles = []
    this.offsetX = 0
    for (let x = -300; x < 1000; x += 1.5) {
      for (let y = 260; y < 600; y += 1.5) {
        let topCurve    = 250 + sin((y - 260) * 0.02) * 60
        let bottomCurve = 880 - cos((y - 260) * 0.015) * 350
        if ((x > topCurve && y > 300) || (x > bottomCurve && y > 450)) {
          this.particles.push({ baseX: x, baseY: y })
        }
      }
    }
  }
  update(isReforming) {
    this.offsetX = lerp(this.offsetX, isReforming ? -70 : -220, 0.05)
  }
  draw() {
    fill(10, 77, 117)
    noStroke()
    this.particles.forEach(p => {
      circle(p.baseX + this.offsetX + 80, p.baseY + 60, 3.5)
    })
  }
}

class Glacier {
  constructor() {
    this.particles = []
    this.radius = 3
    this.gridSize = 2
    this.isReforming = false
    this.autoMeltTriggered = false

    this.mainVertices = [
      createVector(480,420), createVector(500,360),
      createVector(530,300), createVector(560,280),
      createVector(590,260), createVector(610,240),
      createVector(630,220), createVector(650,250),
      createVector(680,280), createVector(710,310),
      createVector(740,340), createVector(770,380),
      createVector(790,420)
    ]
    this.coreVertices = [
      createVector(570,380), createVector(585,340),
      createVector(600,310), createVector(625,295),
      createVector(660,305), createVector(690,335),
      createVector(705,385), createVector(675,430),
      createVector(620,440), createVector(590,410)
    ]
    this.setupParticles()
  }
  setupParticles() {
    for (let x = 480; x < 790; x += this.gridSize) {
      for (let y = 200; y < 440; y += this.gridSize) {
        if (this.pointInPolygon(x, y, this.mainVertices)) {
          let isCore = this.pointInPolygon(x, y, this.coreVertices)
          this.particles.push(new Particle(x, y, isCore))
        }
      }
    }
  }
  pointInPolygon(px, py, vs) {
    let inside = false
    for (let i=0, j=vs.length-1; i<vs.length; j=i++) {
      let xi=vs[i].x, yi=vs[i].y
      let xj=vs[j].x, yj=vs[j].y
      let intersect = ((yi>py)!=(yj>py))
                   && (px < (xj-xi)*(py-yi)/(yj-yi)+xi)
      if (intersect) inside = !inside
    }
    return inside
  }
  update() {
    let fully = true
    this.particles.forEach(p => {
      if (this.isReforming) {
        p.reform(); if (!p.isFullyReformed()) fully = false
      } else {
        p.melt()
      }
    })
    if (this.isReforming && fully && !this.autoMeltTriggered && !sequenceComplete) {
      this.autoMeltTriggered = true
      setTimeout(() => {
        this.isReforming = false
        this.particles.forEach(p => p.resetCounters())
        this.autoMeltTriggered = false
      }, 100)
    }
  }
  draw() {
    this.particles.forEach(p => {
      if (this.isReforming || p.isCore || p.y < height - 63) {
        p.display(this.radius)
      }
    })
  }
  reformOnce() {
    this.isReforming = true
    this.autoMeltTriggered = false
    this.particles.forEach(p => p.resetCounters())
  }
}

class Building {
  constructor(x,y,w,h,antenna) {
    this.x=x; this.y=y; this.w=w; this.h=h
    this.originalH=h; this.damaged=true
    this.hasAntenna=antenna||false
  }
  update() {
    this.h = lerp(this.h,
      this.damaged ? this.originalH*0.6 : this.originalH,
      0.1)
  }
  draw() {
    fill(30); stroke(20); strokeWeight(1.5)
    rect(this.x, this.y+(this.originalH-this.h), this.w, this.h)
    if(this.hasAntenna) {
      line(
        this.x+this.w/2,
        this.y+(this.originalH-this.h),
        this.x+this.w/2,
        this.y+(this.originalH-this.h)-20
      )
    }
    fill(this.damaged?60:180); noStroke()
    for(let wy=10; wy<this.h-10; wy+=20){
      for(let wx=5; wx<this.w-5; wx+=15){
        rect(
          this.x+wx,
          this.y+(this.originalH-this.h)+wy,
          6,8
        )
      }
    }
  }
  toggleDamage(){ this.damaged=!this.damaged }
}

class BuildingManager {
  constructor(){
    this.buildings=[]
    ;[
      {x:50,y:80,w:45,h:300,antenna:true},
      {x:10,y:120,w:35,h:260},{x:120,y:150,w:38,h:230},
      {x:160,y:130,w:30,h:250},{x:40,y:280,w:30,h:120},
      {x:90,y:290,w:25,h:110},{x:150,y:300,w:28,h:100},
      {x:70,y:270,w:22,h:130},{x:0,y:380,w:60,h:30},
      {x:80,y:395,w:55,h:35},{x:160,y:400,w:50,h:25},
      {x:30,y:390,w:45,h:20}
    ].forEach(s=>this.buildings.push(
      new Building(s.x,s.y,s.w,s.h,s.antenna)
    ))
    this.autoCollapseTriggered=false
  }
  update(){
    this.buildings.forEach(b=>b.update())
    let allGood = this.buildings.every(
      b=>!b.damaged && abs(b.h-b.originalH)<1
    )
    if(!this.autoCollapseTriggered && allGood && !sequenceComplete){
      this.autoCollapseTriggered=true
      setTimeout(()=>{
        this.buildings.forEach(b=>b.toggleDamage())
        this.autoCollapseTriggered=false
      },500)
    }
  }
  draw(){ this.buildings.forEach(b=>b.draw()) }
  reformOnce(){
    this.buildings.forEach(b=>b.damaged=false)
    this.autoCollapseTriggered=false
  }
}

class Vine {
  constructor(baseX,angle){
    this.baseX=baseX; this.angle=angle
    this.length=180; this.amplitude=20
    this.points=[]; this.retractAmount=0
    this.targetRetract=0
    this.greenShade=map(this.baseX,0,500,100,200)
    this.generatePath()
  }
  generatePath(){
    for(let t=0;t<=1;t+=0.01){
      let x=this.baseX+this.amplitude*sin(TWO_PI*t*8)
      let y=360-t*this.length
      let rx=this.baseX+(x-this.baseX)*cos(this.angle)
             -(y-360)*sin(this.angle)
      let ry=360+(x-this.baseX)*sin(this.angle)
             +(y-360)*cos(this.angle)
      this.points.push(createVector(rx,ry))
    }
  }
  startRetract(state){ this.targetRetract=state?1:0 }
  update(){ this.retractAmount=lerp(this.retractAmount,this.targetRetract,0.05) }
  display(){
    stroke(20,this.greenShade,20)
    strokeWeight(17)
    noFill()
    beginShape()
      let count=floor(this.points.length*(1-this.retractAmount))
      for(let i=0;i<count;i++){
        vertex(this.points[i].x,this.points[i].y)
      }
    endShape()
  }
}

class Plant {
  constructor(x,y){
    this.x=x; this.y=y
    this.type=random(['pine','tallFlower','shortFlower','bush'])
  }
  display(){
    push(); translate(this.x,this.y)
    if(this.type==='pine'){
      fill(34,85,28)
      triangle(-6,0,0,-20,6,0)
      triangle(-4,-8,0,-28,4,-8)
    } else if(this.type==='tallFlower'){
      stroke(60,120,50); line(0,0,0,-12)
      noStroke(); fill(255,200,0); ellipse(0,-15,6,6)
    } else if(this.type==='shortFlower'){
      stroke(60,120,50); line(0,0,0,-8)
      noStroke(); fill(200,100,200); ellipse(0,-10,5,5)
    } else {
      fill(30,100,40); ellipse(0,0,10,6)
    }
    pop()
  }
}
