/**
 * This script will contain the mobile-scaled version of Playing In The Waves
 * 
 * The primary version, the Playground, as lots of buttons laid out horizontally. 
 * This is great for computer screens, but bad for phone screens which are vertical. 
 * 
 * This program will have significantly less functionality than the Playground,
 * but at least among my personal friends and family, will by far 
 * be the most accessed.
 * 
 */

let w=window.innerWidth, h=window.innerHeight;
let mic;
let recButX=(0.1 * w), recButY=(0.13 * h), recButWd=(0.8 * w), recButHt=(0.2 * h);
let samplerButton1, samplerButton2, controls1, controls2;
let volNode1, volNode2, effectBus, limiter;
let delay;
let ampModLFO;

function preload() {
    limiter = new Tone.Limiter(-1).toDestination();
    volNode1 = new Tone.Volume().connect(limiter);
    volNode2 = new Tone.Volume().connect(limiter);
    effectBus = new Tone.Volume().connect(limiter);
}

function setup() {
    createCanvas(w,h);

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    //  new SamplerButton instances to record user input
    samplerButton1 = new SamplerButton(recButX, recButY, recButWd, recButHt);  
    samplerButton1.player.connect(volNode1);
    buttonSignal1 = new SignalCircle(recButX + (0.5 * recButWd), recButY - (0.2 * recButHt), 0.3 * recButHt);

    samplerButton2 = new SamplerButton(recButX, (recButY + (recButHt * 2.1)), recButWd, recButHt);
    samplerButton2.player.connect(volNode2);
    buttonSignal2 = new SignalCircle(recButX + (0.5 * recButWd), (recButY + (recButHt * 2.2)) - (0.3 * recButHt), 0.3 * recButHt);

    mic.connect(samplerButton1.recorder);      //  connect microphone output to Tone recorder object
    mic.connect(samplerButton2.recorder);      

    controls1 = new PhoneControls(recButX, recButY, recButWd, recButHt, samplerButton1.player, volNode1);
    controls2 = new PhoneControls(recButX, (recButY + (recButHt * 2.1)), recButWd, recButHt, samplerButton2.player, volNode2);

    controls1.connectToBus(effectBus);
    controls2.connectToBus(effectBus);

    Tone.Transport.start();
}

function draw() {
    background(0, 150, 80);     //  background color

    noStroke();     //  set up title text
    textAlign(CENTER);
    textSize(30);
    fill(0);
    text('Playing In The Waves', 0.5 * w, 0.05 * h);     //  title text

    if (samplerButton1.state == 'recording') {
        buttonSignal1.drawRecordingCircle();
    }

    if (samplerButton2.state == 'recording') {
        buttonSignal2.drawRecordingCircle();
    }
}