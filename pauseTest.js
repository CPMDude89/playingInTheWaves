let soundFile;
function preload() {
  soundFormats('ogg', 'mp3');
  soundFile = loadSound('sounds/mothership.mp3');
}
function setup() {
  let cnv = createCanvas(100, 100);
  cnv.mousePressed(canvasPressed);
  background(220);
  text('tap to play, release to pause', 10, 20, width - 20);
}
function canvasPressed() {
  soundFile.loop();
  background(0, 200, 50);
}
function mouseReleased() {
  soundFile.pause();
  background(220);
}