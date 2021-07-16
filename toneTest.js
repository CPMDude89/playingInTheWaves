let w = window.innerWidth;
let h = window.innerHeight;
let testButton, testButtonX=0.5 * w, testButtonY=0.5 * h, testButtonWidth=0.1 * w, testButtonHeight=0.1 * h;
let osc;
let testToneActive = false;
let lfo;
let wave;

function setup() {
  createCanvas(w, h);


  testButton = createButton('TEST TONE');
  testButton.position(testButtonX, testButtonY);
  testButton.size(testButtonWidth, testButtonHeight);
  testButton.mousePressed(testTone);

  osc = new Tone.Oscillator().toDestination();  //  test oscillator
  

  wave = new Tone.Waveform();
  wave.size = 2048;
  osc.connect(wave);

  lfo = new Tone.LFO(1, -60, 0);
  lfo.connect(osc.volume);

  
}

function draw() {
    background(0, 100, 20);

    osc.frequency.value = map(mouseX, 0, w, 30, 500);

    stroke(255);
    strokeWeight(2);
    noFill();
    let buffer = wave.getValue(0);
    beginShape()
    for (let i = 0; i < buffer.length; i++) {
      let x = map(i, 0, buffer.length, 0, w);
      let y = map(buffer[i], -1, 1, h, 0);

      //point(x, y);
      vertex(x,y);
    }
    endShape();


}

function testTone() {
  if (!testToneActive) {
    console.log('BUTTON PRESSED');
    osc.start("+0.01");
    osc.volume.value = -70;

    lfo.start();

    testToneActive = true;
  }
  else {
    console.log('BUTTON PRESSED AGAIN');
    osc.stop("+0.05");

    testToneActive = false;
  }
}

