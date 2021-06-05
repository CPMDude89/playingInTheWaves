//pause example 0
let soundFile;
function preload() {
  soundFormats('ogg', 'mp3');
  soundFile = loadSound('sounds/dave_holland_test.mp3');
}
function setup() {
  let cnv = createCanvas(100, 100);
  cnv.mousePressed(canvasPressed);
  background(220);
  text('tap to play, release to pause', 10, 20, width - 20);
}
function canvasPressed() {
  soundFile.play();
  background(0, 200, 50);
}
function mouseReleased() {
  soundFile.pause();
  background(220);
}