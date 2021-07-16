let w = window.innerWidth;
let h = window.innerHeight;
let recBut, recButX=0.5 * w, recButY=0.5 * h, recButWd=0.2 * w, recButHt=0.2 * h;
let playBut;
let recActive = false;
let mic, recorder, player, buffer;
let data, bloburl;


function setup() {
  createCanvas(w, h);

  recBut = createButton('RECORD');    //  setting up record button
  recBut.position(recButX, recButY);
  recBut.size(recButWd, recButHt);
  recBut.mousePressed(toneRecord);

  

  mic = new Tone.UserMedia();   //  get microphone input
  recorder = new Tone.Recorder();   //  set up Tone recorder object

  mic.connect(recorder);    //  connect output of microphone to recorder object
  mic.open();

  buffer = new Tone.ToneAudioBuffer();

}

function draw() {
    background(0, 100, 20);   //  nice dark green

    

}

async function toneRecord() { //  here we go, recording with Tone.js
  if (!recActive) {   //  activate recording
    console.log('PRESSED TO ACTIVATE');

    setTimeout(function() {recorder.start()}, 120);

    recActive = true;
  }
  else {
    console.log('PRESSED TO DEACTIVATE');   //  deactivate recording

    data = await recorder.stop();
    bloburl = URL.createObjectURL(data);

    buffer = new Tone.ToneAudioBuffer(bloburl);

    player = new Tone.Player(buffer).toDestination();


    createButtons();


    recActive = false;
  }
}

function createButtons() {
  playBut = createButton('PLAY');
  playBut.position(recButX, 1.5 * recButY);
  playBut.size(recButWd, recButHt);
  playBut.mousePressed(function() {
    player.start();
  }) 
}









/*
let testButton, testButtonX=0.5 * w, testButtonY=0.5 * h, testButtonWidth=0.1 * w, testButtonHeight=0.1 * h;
let osc;
let testToneActive = false;
let lfo;
let wave;
*/


/*  //  THIS WAS TEST CODE TO GET AMP MOD WORKING ---- IN SETUP()

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


*/


/*    //  THIS WAS TEST CODE TO GET AMP MOD WORKING ---- IN DRAW()
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
*/

/*
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
*/