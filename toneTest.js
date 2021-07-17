let w = window.innerWidth;
let h = window.innerHeight;

let testButton, testButtonX=0.5 * w, testButtonY=0.5 * h, testButtonWidth=0.1 * w, testButtonHeight=0.1 * h;
let osc;
let testToneActive = false;
let lfo;
let lfoButton, lfoActive=false;
let tremolo;
let wave;
let lfoFreqSlider, lfoPhaseSlider;
let gainNode, osc1;
let volNode;


function setup() {       //  THIS WAS TEST CODE TO GET AMP MOD WORKING ---- IN SETUP()
  createCanvas(w, h);
  
  testButton = createButton('TEST TONE');
  testButton.position(testButtonX, testButtonY);
  testButton.size(testButtonWidth, testButtonHeight);
  testButton.mousePressed(testTone);

  lfoButton = createButton('AMP MOD');
  lfoButton.position(testButtonX, 0.5 * testButtonY);
  lfoButton.size(testButtonWidth, testButtonHeight);
  lfoButton.mousePressed(triggerLFO);

  volNode = new Tone.Volume(0).toDestination();

  //osc = new Tone.Oscillator(220).toDestination();  //  test oscillator
  osc = new Tone.Oscillator(220).connect(volNode);  //  test oscillator
  //osc = new Tone.Oscillator(220);  //  test oscillator
  
  wave = new Tone.Waveform();
  wave.size = 2048;
  //osc.connect(wave);
  volNode.connect(wave);

  lfo = new Tone.LFO(1, -100, 0);
  lfo.phase = 90;
  //lfo.connect(osc.volume);
  lfo.connect(volNode.volume);
  //lfo.connect(Tone.getDestination().volume);

  lfoFreqSlider = createSlider(0.1, 40, 1, 0.1);
  lfoFreqSlider.position(0.3 * w, 0.75 * h);
  lfoFreqSlider.size(w/3, 0.01 * h);

  lfoPhaseSlider = createSlider(0, 360, 90, 0.01);
  lfoPhaseSlider.position(0.3 * w, 0.85 * h);
  lfoPhaseSlider.size(0.33 * w, 0.01 * h);


  
}




function draw() {    //  THIS WAS TEST CODE TO GET AMP MOD WORKING ---- IN DRAW()
  background(0, 100, 20);

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
  
  //  test text
  textSize(40);
  fill(0);
  textAlign(CENTER);
  text('LFO FREQUENCY', 0.45 * w, 0.74 * h);
  lfo.frequency.rampTo(lfoFreqSlider.value(), 0.05);

  text('LFO PHASE', 0.45 * w, 0.84 * h);
  //lfo.phase = lfoPhaseSlider.value();

}

function testTone() {
  if (!testToneActive) {    //  trigger carrier signal
    osc.start();
    
    console.log(osc.volume.value);

    testToneActive = true;
  }
  else {
    console.log('BUTTON PRESSED AGAIN');
    osc.stop();

    testToneActive = false;
  }
}

function triggerLFO() {
  if (!lfoActive) {   //  trigger modulating signal
    //osc.volume.rampTo(-100, 0.1);
    volNode.volume.rampTo(-100, 0.1);
    //Tone.getDestination().volume.rampTo(-100, 0.1);
    
    lfo.start();
    
    //lfo.connect(osc.volume);

    lfoActive = true;
  }
  else {
    lfo.amplitude.rampTo(0, 0.1);
    volNode.volume.rampTo(0, 0.1);

    lfo.stop("+0.1");

    lfo.amplitude.rampTo(1, 0.5);
    lfo.phase = 90;
    
    //osc.volume.rampTo(0, 0.1);
    
    lfoActive = false;
  }
}




















































/*
let recBut, recButX=0.5 * w, recButY=0.5 * h, recButWd=0.2 * w, recButHt=0.2 * h;
let playBut;
let recActive = false;
let mic, recorder, player, buffer;
let data, bloburl;

/*
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
*/









