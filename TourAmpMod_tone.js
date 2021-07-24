/**
 * A part of Playing In The Waves' 'Tour'
 * This program will take in the user's input, and store it in a new audio buffer. 
 * Then it can be played back, and the amplitude of buffer playback will be attached to a p5.Oscillator
 * The phase of the LFO modulating the buffer's amplitude will be animated
 *          to help visualize how an LFO can affect a sound's volume
 * 
 * Made with Tone.js!
 */

let w = window.innerWidth;
let h = window.innerHeight;
let mic;
let recButX=(0.11 * w), recButY=(0.2 * h), recButWd=(0.1 * w), recButHt=(0.1 * h);
let lfoVizRectX=(0.85 * w), lfoVizRectY=(recButY), lfoVizRectWd=(0.03 * w), lfoVizRectHt=(0.6 * h);
let lfoFreqSlider, sliderWd=(0.6 * w);
let soundVizX=0.5 * w, soundVizY=0.7 * h, soundVizWd=0.45 * w, soundVizHt=0.5 * h;
let testToneButton, testTone, testToneActive=false;
let ampModButton, ampModLFO, ampModActive = false;
let volNode;

function setup() {
    createCanvas(w, h);     //  make p5 canvas

    volNode = new Tone.Volume().toDestination();

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input 

    samplerButton = new SamplerButton(recButX, recButY, recButWd, recButHt);

    samplerButton.player.connect(volNode);
    mic.connect(samplerButton.recorder);

    testTone = new Tone.Oscillator(200, 'sine').connect(volNode);

    ampModLFO = new Tone.LFO(1, -100, 0);
    ampModLFO.phase = 90;
    ampModLFO.connect(volNode.volume);

    ampModButton = createButton('ACTIVATE\nAMP MOD');
    ampModButton.position((2 * recButWd) + recButX, recButY);
    ampModButton.size(recButWd, recButHt);
    ampModButton.mousePressed(triggerAmpMod);

    oscScope = new OscScope(soundVizX, soundVizY, soundVizWd, soundVizHt, 2048);
    volNode.connect(oscScope.wave);

    LFOWave = new Tone.Waveform();
    ampModLFO.connect(LFOWave);

    lfoFreqSlider = createSlider(0.1, 50, 2, 0.1);      //  amp mod freq slider
    lfoFreqSlider.size(sliderWd);
    lfoFreqSlider.position(0.2 * w, 0.4 * h);
    lfoFreqSlider.hide();
    
}

function draw() {
    background(0, 150, 80);     // nice shade of forest green

    noStroke();
    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nAmplitude Modulation', 0.5 * w, 0.05 * h); //  page title

    if (samplerButton.state == 'recording') {     //  if button is recording
        fill(255, 0, 0);    //  red for record light
        circle((recButX + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }

    fill(0);        //  set up LFO visualizer
    rectMode(CORNER);
    rect(lfoVizRectX, lfoVizRectY, lfoVizRectWd, lfoVizRectHt);     //  LFO visualizer vertical bar

    if (ampModActive) {     //  LFO visualizer
        ampModLFO.frequency.rampTo(lfoFreqSlider.value(), 0.05);
        
        fill(100, 50, 150); //  nice purple color
        stroke(0);
        strokeWeight(2);
        //  set output of amp mod lfo to the y-axis of ball to visualize amp mod
        //circle((0.5 * lfoVizRectWd) + lfoVizRectX, map(gain, 0, 1, (lfoVizRectY + lfoVizRectHt), lfoVizRectY), 1.75 * lfoVizRectWd);
        let AMBuffer = LFOWave.getValue();
        let y = AMBuffer[0];
        circle((0.5 * lfoVizRectWd) + lfoVizRectX, map(y, 0, 1, (lfoVizRectY + lfoVizRectHt), lfoVizRectY), 1.75 * lfoVizRectWd);
        
        fill(0);
        noStroke();
        textSize(40);
        text('Amplitude modulation is at rate: ' + lfoFreqSlider.value() + ' Hz', 0.5 * w, 0.38 * h);
    }

    oscScope.process(); //  draw oscilloscope to visualize sound
}

function triggerTestTone() {
    if (!testToneActive) {
        testTone.start();

        testToneActive = true;
    }

    else {
        testTone.stop("+0.05");

        testToneActive = false;
    }
}

function triggerAmpMod() {
    if (!ampModActive) {        //  trigger amp mod on all output
        volNode.volume.rampTo(-100, 0.05);      //  bring down gain of volume node to avoid clipping

        ampModLFO.start();      //  activate LFO to modulate volume

        lfoFreqSlider.show();
        ampModActive = true;    //  flip button boolean
    }

    else {
        volNode.volume.rampTo(0, 0.05);     //  bring volume node back up to normal volume
        ampModLFO.amplitude.rampTo(0, 0.05);    //  bring LFO depth down gradually to avoid clicks as much as possible

        ampModLFO.stop();       //  stop LFO
        ampModLFO.phase = 90;   //  reset LFO phase back to safe place
        ampModLFO.amplitude.rampTo(1, 0.3);     //  bring LFO depth back up 
        
        lfoFreqSlider.hide();
        ampModActive = false;
    }
}