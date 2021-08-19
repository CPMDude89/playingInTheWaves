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
let recButX=(0.03 * w), recButY=(0.18 * h), recButWd=(0.08 * w), recButHt=(0.08 * h);
let lfoViz, lfoVizRectX=(0.85 * w), lfoVizRectY=(recButY), lfoVizRectWd=(0.03 * w), lfoVizRectHt=(0.6 * h);
let lfoFreqSlider, sliderWd=(0.6 * w);
let soundVizX_fund=0.3 * w, soundVizY=0.7 * h, soundVizWd=0.3 * w, soundVizHt=0.5 * h;
let soundVizX_delay=0.67 * w;
let volNode, delayVolNode;
let delay, delayBut, delayActive=false, delayTimeLFO, delayTimeLFOBut, delayTimeLFOActive=false;
let delayButX = (0.57 * w)
let fundWave, delayWave;
let limiter, sample1, sample1Active=false, sample2, sample2Active=false, sample1Button, sample2Button;
let sample3, sample3Active=false, sample4, sample4Active=false;
let samp1ButX=(0.13 * w), samp2ButX=(0.23 * w), samp3ButX=(0.33 * w), samp4ButX=(0.43 * w);
let samplerButton;
let linkForward, linkBackward;
let pageRecorder, pageRecButX = w * 0.9, pageRecButY = 0.85 * h, pageRecButWd=0.65 * recButWd;

//  load sound files and volume nodes
function preload() {
    limiter = new Tone.Limiter(0).toDestination();      //  final out destination
    sample1 = new Tone.Player('./sounds/snaps.wav');
    sample1.loop = true;
    sample2 = new Tone.Player('./sounds/slinky_lazer.wav');
    sample2.loop = true;
    sample3 = new Tone.Player('./sounds/bassSlide.wav');
    sample3.loop = true;
    sample4 = new Tone.Player('./sounds/beat1.wav');
    sample4.loop = true;
}

function setup() {
    createCanvas(w, h);

    //  set up volume nodes out
    volNode = new Tone.Volume();
    delayVolNode = new Tone.Volume({
        volume: -100
    }).connect(limiter);

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    //  SamplerButton to record and playback user input
    samplerButton = new SamplerButton(recButX, recButY, recButWd, recButHt);
    samplerButton.player.connect(volNode);
    samplerSignal = new SignalCircle(((recButX) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt); 

    mic.connect(samplerButton.recorder);      //  connect microphone output to Tone recorder object

    //  delay button
    delayBut = createButton('ACTIVATE DELAY');
    delayBut.position(delayButX, 0.9 * recButY);
    delayBut.size(recButWd, 1.3 * recButHt);
    delayBut.mousePressed(triggerDelay);

    //  delay lfo button
    delayTimeLFOBut = createButton('ACTIVATE DELAY TIME LFO');
    delayTimeLFOBut.position(delayButX + 1.5 * recButWd, 0.9 * recButY);
    delayTimeLFOBut.size(recButWd, 1.3 * recButHt);
    delayTimeLFOBut.mousePressed(triggerDelayTimeLFO);

    //  stock sample buttons
    sample1.connect(volNode);
    sample1Button = createButton('SAMPLE 1');
    sample1Button.position(samp1ButX, recButY);
    sample1Button.size(recButWd, recButHt);
    sample1Button.mousePressed(triggerSample1);
    sample1Signal = new SignalCircle(((samp1ButX) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);

    sample2.connect(volNode);
    sample2Button = createButton('SAMPLE 2');
    sample2Button.position(samp2ButX, recButY);
    sample2Button.size(recButWd, recButHt);
    sample2Button.mousePressed(triggerSample2);
    sample2Signal = new SignalCircle(((samp2ButX) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);

    sample3.connect(volNode);
    sample3Button = createButton('SAMPLE 3');
    sample3Button.position(samp3ButX, recButY);
    sample3Button.size(recButWd, recButHt);
    sample3Button.mousePressed(triggerSample3);
    sample3Signal = new SignalCircle(((samp3ButX) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);

    sample4.connect(volNode);
    sample4Button = createButton('SAMPLE 4');
    sample4Button.position(samp4ButX, recButY);
    sample4Button.size(recButWd, recButHt);
    sample4Button.mousePressed(triggerSample4);
    sample4Signal = new SignalCircle(((samp4ButX) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);

    //  initialize delay
    delay = new Tone.FeedbackDelay({
        delayTime: 0.5,
        feedback: 0.5,
        wet: 1
    }).connect(delayVolNode);

    volNode.fan(delay, limiter);    //  connect volume node to delay line

    delayTimeLFO = new Tone.LFO({   //  delay time LFO initialization
        amplitude: 1,
        frequency: 0.05,
        min: 0.001,
        max: 0.95,
        phase: 90       //  just in case, keep these LFO's at phase = 90
    });

    //  delay time LFO freq slider
    lfoFreqSlider = createSlider(0.01, 0.3, 0.05, 0.001);      
    lfoFreqSlider.size(sliderWd);
    lfoFreqSlider.position(0.2 * w, 0.4 * h);
    lfoFreqSlider.hide();

    //  visualizer for delay time LFO
    lfoViz = new LFOVisualizer(lfoVizRectX, lfoVizRectY, lfoVizRectWd, lfoVizRectHt, 100, 150, 200);
    delayTimeLFO.connect(lfoViz.wave);

    //  scope for fundamental sound
    fundScope = new OscScope(soundVizX_fund, soundVizY, soundVizWd, soundVizHt, 2048, 1024, false);
    volNode.connect(fundScope.wave);

    //  scope for delay line
    delayScope = new OscScope(soundVizX_delay, soundVizY, soundVizWd, soundVizHt, 2048, 1024, false);
    delayVolNode.connect(delayScope.wave);

    //  navigational links around Tour
    linkBackward = createA('https://cpmdude89.github.io/playingInTheWaves/TourAmpMod.html', 'PREVIOUS TOUR STOP');
    linkBackward.position(0.05 * w, 0.04 * h);
    linkBackward.style('font-size', '1.5vw');
    
    linkForward = createA('https://cpmdude89.github.io/playingInTheWaves/TourAudioSlicer.html', 'NEXT TOUR STOP');
    linkForward.position(0.8 * w, 0.04 * h);
    linkForward.style('font-size', '1.5vw');

    //  recorder for page output
    pageRecorder = new PageRecorder(pageRecButX, pageRecButY, pageRecButWd, recButHt);
    limiter.connect(pageRecorder.recorder);
    pageRecorderSignal = new SignalCircle(pageRecButX + (0.5 * pageRecButWd), pageRecButY - (0.5 * recButHt), 0.4 * recButHt);

    Tone.Transport.start();
}

function draw() {
    textOutput();
    background(0, 150, 80);
    
    noStroke();
    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nDelay', 0.5 * w, 0.05 * h); //  page title

    //  Signal Circles
    if (samplerButton.state == 'recording') {     
        samplerSignal.drawRecordingCircle();
    }

    if (samplerButton.player.state == 'started') {    
        samplerSignal.drawActiveCircle();
    }   

    if (sample1Active) {
        sample1Signal.drawActiveCircle();
    }

    if (sample2Active) {
        sample2Signal.drawActiveCircle();
    }

    if (sample3Active) {
        sample3Signal.drawActiveCircle();
    }

    if (sample4Active) {
        sample4Signal.drawActiveCircle();
    }

    if (pageRecorder.state == 'recording') {
        pageRecorderSignal.drawRecordingCircle();
    }

    //  trigger controls for delay time lfo
    if (delayTimeLFOActive) {
        delayTimeLFO.frequency.rampTo(lfoFreqSlider.value(), 0.05);
        lfoViz.process();
        fill(0);
        noStroke();
        textSize(34);
        text('Delay time LFO is at rate: ' + lfoFreqSlider.value().toFixed(2) + ' Hz', 0.5 * w, 0.34 * h);
        text('Delay time is: ' + lfoViz.getLFOPhase() + ' seconds long', 0.5 * w, 0.38 * h);
    }

    //  if user input or stock sample triggered, display fundamental scope
    if (samplerButton.player.state == 'started' || sample1Active || sample2Active || sample3Active || sample4Active) {
        fundScope.process();
    }

    //  if delay active, trigger delay scope
    if (delayActive) {
        delayScope.process();
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
        delayTimeLFO.connect(delay.delayTime);
        delayTimeLFO.start();
        lfoFreqSlider.show();
        delayTimeLFOBut.html('DEACTIVATE DELAY TIME LFO');
        delayTimeLFOActive = true;
    }
    else {  //  if LFO is on, turn off
        delayTimeLFO.disconnect();
        delayTimeLFO.connect(lfoViz.wave);
        delayTimeLFO.stop();
        lfoFreqSlider.hide();
        delay.delayTime.value = 0.5;
        delayTimeLFOBut.html('ACTIVATE DELAY TIME LFO');
        delayTimeLFOActive = false;
    }
}

//  STOCK SAMPLE FUNCTIONS
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

function triggerSample3() {
    if (!sample3Active) {
        sample3.start();
        sample3.volume.rampTo(0, 0.05);
        sample3Active = true;
    }
    else {
        sample3.volume.rampTo(-100, 0.05);
        sample3.stop("+0.05");
        sample3Active = false;
    }
}

function triggerSample4() {
    if (!sample4Active) {
        sample4.start();
        sample4.volume.rampTo(0, 0.05);
        sample4Active = true;
    }
    else {
        sample4.volume.rampTo(-100, 0.05);
        sample4.stop("+0.05");
        sample4Active = false;
    }
}