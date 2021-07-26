/**
 * Here is the Delay component of the 'tour'
 * User can record into a buffer or pick from an available sound, which will then go into a delay line
 * The delay time will be connected to an LFO as well
 * The delay line is running from program load, so the button will just toggle its volume bus up and down
 * This way, the delay will fade out naturally if turned off
 * 
 * Both the original input and the delay line will be visualized
 * hopefully
 */

let w = window.innerWidth, h = window.innerHeight;
let mic;
let recButX=(0.08 * w), recButY=(0.18 * h), recButWd=(0.1 * w), recButHt=(0.1 * h);
let lfoViz, lfoVizRectX=(0.85 * w), lfoVizRectY=(recButY), lfoVizRectWd=(0.03 * w), lfoVizRectHt=(0.6 * h);
let lfoFreqSlider, sliderWd=(0.6 * w);
let soundVizX_fund=0.3 * w, soundVizY=0.7 * h, soundVizWd=0.3 * w, soundVizHt=0.5 * h;
let soundVizX_delay=0.67 * w;
let volNode, delayVolNode;
let delay, delayBut, delayActive=false, delayTimeLFO, delayTimeLFOBut, delayTimeLFOActive=false;
let fundWave, delayWave;
let limiter, sample1, sample1Active=false, sample2, sample2Active=false, sample1Button, sample2Button;
let samplerButton;
let linkForward, linkBackward;


function preload() {
    limiter = new Tone.Limiter(0).toDestination();
    sample1 = new Tone.Player('./sounds/Mike_Hayes_beat.wav');
    sample1.loop = true;
    sample2 = new Tone.Player('./sounds/snaps.wav');
    sample2.loop = true;
}

function setup() {
    createCanvas(w, h);

    volNode = new Tone.Volume();
    delayVolNode = new Tone.Volume({
        volume: -100
    }).connect(limiter);

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    samplerButton = new SamplerButton(recButX, recButY, recButWd, recButHt);
    samplerButton.player.connect(volNode);

    mic.connect(samplerButton.recorder);      //  connect microphone output to Tone recorder object

    delayBut = createButton('ACTIVATE DELAY');
    delayBut.position((0.48 * w) + recButX, recButY);
    delayBut.size(recButWd, recButHt);
    delayBut.mousePressed(triggerDelay);

    delayTimeLFOBut = createButton('ACTIVATE DELAY TIME LFO');
    delayTimeLFOBut.position((6 * recButWd) + recButX, recButY);
    delayTimeLFOBut.size(recButWd, recButHt);
    delayTimeLFOBut.mousePressed(triggerDelayTimeLFO);

    sample1.connect(volNode);
    sample1Button = createButton('SAMPLE 1');
    sample1Button.position(0.2 * w, recButY);
    sample1Button.size(recButWd, recButHt);
    sample1Button.mousePressed(triggerSample1);

    sample2.connect(volNode);
    sample2Button = createButton('SAMPLE 2');
    sample2Button.position(0.32 * w, recButY);
    sample2Button.size(recButWd, recButHt);
    sample2Button.mousePressed(triggerSample2);

    delay = new Tone.FeedbackDelay({
        feedback: 0.5,
        wet: 1
    }).connect(delayVolNode);

    volNode.fan(delay, limiter);

    delayTimeLFO = new Tone.LFO({
        amplitude: 1,
        frequency: 0.05,
        min: 0.001,
        max: 0.95
    }).connect(delay.delayTime);

    lfoFreqSlider = createSlider(0.01, 0.6, 0.05, 0.001);      //  delay time LFO freq slider
    lfoFreqSlider.size(sliderWd);
    lfoFreqSlider.position(0.2 * w, 0.4 * h);
    lfoFreqSlider.hide();

    lfoViz = new LFOVisualizer(lfoVizRectX, lfoVizRectY, lfoVizRectWd, lfoVizRectHt, 100, 150, 200);
    delayTimeLFO.connect(lfoViz.wave);

    fundScope = new OscScope(soundVizX_fund, soundVizY, soundVizWd, soundVizHt, 2048, false);
    volNode.connect(fundScope.wave);

    delayScope = new OscScope(soundVizX_delay, soundVizY, soundVizWd, soundVizHt, 2048, false);
    delayVolNode.connect(delayScope.wave);

    linkBackward = createA('https://cpmdude89.github.io/playingInTheWaves/TourAmpMod.html', 'PREVIOUS TOUR STOP');
    linkBackward.position(0.05 * w, 0.05 * h);
    
    linkForward = createA('https://cpmdude89.github.io/playingInTheWaves/TourGranulation.html', 'NEXT TOUR STOP');
    linkForward.position(0.8 * w, 0.05 * h);

    Tone.Transport.start();
}

function draw() {
    background(0, 150, 80);
    
    noStroke();
    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nDelay', 0.5 * w, 0.05 * h); //  page title

    if (samplerButton.state == 'recording') {     //  if button is recording
        fill(255, 0, 0);    //  red for record light
        circle((recButX + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }

    if (samplerButton.player.state == 'started') {    //  if sampler button is playing
        fill(0, 0, 255);    //  blue
        circle((recButX + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }   

    if (delayActive) {
        fill(0, 0, 255);    //  blue
        circle(((0.48 * w) + recButX + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
        delayScope.process();
    }

    if (sample1Active) {
        fill(0, 0, 255);    //  blue
        circle(((0.2 * w) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }

    if (sample2Active) {
        fill(0, 0, 255);    //  blue
        circle(((0.32 * w) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }

    if (delayTimeLFOActive) {
        delayTimeLFO.frequency.rampTo(lfoFreqSlider.value(), 0.05);
        lfoViz.process();
        fill(0);
        noStroke();
        textSize(34);
        text('Delay time LFO is at rate: ' + lfoFreqSlider.value().toFixed(2) + ' Hz', 0.5 * w, 0.34 * h);
        text('Delay time is: ' + lfoViz.getLFOPhase() + ' seconds long', 0.5 * w, 0.38 * h);
    }

    if (samplerButton.player.state == 'started' || sample1Active || sample2Active) {
        fundScope.process();
    }
}

function triggerDelay() {   //  switch delay on/off
    if (!delayActive) {   //  if not already on
        delayVolNode.volume.rampTo(0, 0.1); //  ramp delay volume up to normal in 100 ms
        delayBut.html('DEACTIVATE DELAY');
        delayActive = true;
    }
    else {  //  if already on
        delayVolNode.volume.rampTo(-100, 0.1);  //  ramp delay volume down to silent in 100 ms
        delayBut.html('ACTIVATE DELAY');
        delayActive = false;
    }
}

function triggerDelayTimeLFO() {    //  switch delay time LFO on/off
    if (!delayTimeLFOActive) {  //  if lfo is off, turn on
        delayTimeLFO.start();
        lfoFreqSlider.show();
        delayTimeLFOBut.html('DEACTIVATE DELAY TIME LFO');
        delayTimeLFOActive = true;
    }
    else {  //  if LFO is on, turn off
        delayTimeLFO.stop();
        lfoFreqSlider.hide();
        delayTimeLFOBut.html('ACTIVATE DELAY TIME LFO');
        delayTimeLFOActive = false;
    }
}

function triggerSample1() {
    if (!sample1Active) {
        sample1.start();
        sample1.volume.rampTo(0, 0.05);
        sample1Active = true;
    }
    else {
        sample1.volume.rampTo(-100, 0.05);
        sample1.stop("+0.05");
        sample1Active = false;
    }
}

function triggerSample2() {
    if (!sample2Active) {
        sample2.start();
        sample2.volume.rampTo(0, 0.05);
        sample2Active = true;
    }
    else {
        sample2.volume.rampTo(-100, 0.05);
        sample2.stop("+0.05");
        sample2Active = false;
    }
}