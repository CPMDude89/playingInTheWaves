let soundFile;
let bjump = false;

function preload() {
  soundFormats('ogg', 'mp3');
  soundFile = loadSound('assets/loop.mp3');
}

function setup() {
  frameRate(30)
  let cnv = createCanvas(500, 100);
  cnv.mousePressed(canvasPressed);
  background(220);
}

function draw(){
  if(bjump){
    background(0, 200, 50);
  }
  else background(220);
  // mouse x
  let mx = mouseX / width;
  // do some boundary checking
  if(mx < 0.001) mx = 0.001;
  if(mx > 1.0) mx = 1.0;
  // mouse y
  let my = 1 - (mouseY / height);
  // do some boundary checking
  if(my < 0.001) my = 0.001;
  if(my > 0.5) my = 0.5;
  if(bjump){
  let r = random();
  if(r > 0.1){
      //soundFile.jump(mx * (soundFile.duration()-my),my);
      soundFile.play(0, 1, 1, mx * (soundFile.duration()-my), my)
  }
}
text('press to play, release to pause', 10, 20, width - 20);
text('mx ' + mx, 10, 40, width - 20);
text('my ' + my, 10, 60, width - 20);
}

function canvasPressed() {
  bjump = true;
}

function mouseReleased() {
  bjump = false;
}
