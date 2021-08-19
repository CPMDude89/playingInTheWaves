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
let recButX=(0.06 * w), recButY=(0.2 * h), recButWd=(0.1 * w), recButHt=(0.08 * h);
let samp1ButX=(0.18 * w), samp2ButX=(0.3 * w), samp3ButX=(0.42 * w), samp4ButX=(0.54 * w);
let soundVizX=0.5 * w, soundVizY=0.68 * h, soundVizWd=0.55 * w, soundVizHt=0.57 * h;
let lfoVizRectX=(0.88 * w), lfoVizRectY=(recButY), lfoVizRectWd=(0.03 * w), lfoVizRectHt=(0.72 * h);
let lfoFreqSlider, sliderWd=(0.6 * w);
let testToneButton, testTone, testToneActive=false;
let ampModButton, ampModLFO, ampModActive = false, ampModHighFreq=false;
let volNode;
let sample1, sample1Active=false, sample2, sample2Active=false, sample3, sample3Active=false, sample4, sample4Active=false;
let loop, transport;
let linkForward, linkBackward;
let scopeTypeButton;
let pageRecorder, pageRecButX = w * 0.93, pageRecButY = soundVizY + (0.5 * soundVizHt) - recButHt, pageRecButWd=0.5 * recButWd;

//  load sound files and volume nodes
function preload() {
    limiter = new Tone.Limiter(0).toDestination();
    volNode = new Tone.Volume().connect(limiter);    //  primary output node
    
    //  load stock samples
    sample1 = new Tone.Player("./sounds/water_bottle_shake.wav").connect(volNode);     
    sample1.loop = true;
    sample2 = new Tone.Player("./sounds/paper_glide.wav").connect(volNode);
    sample2.loop = true;
    sample3 = new Tone.Player("./sounds/martina_2.wav").connect(volNode);
    sample3.loop = true;
    sample4 = new Tone.Player("./sounds/bassHarmonics.wav").connect(volNode);
    sample4.loop = true;
}

function setup() {
    createCanvas(w, h);     //  make p5 canvas

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input 

    //  initialize sampler button for recording and playback
    samplerButton = new SamplerButton(recButX, recButY, recButWd, recButHt);   
    samplerSignal = new SignalCircle(((recButX) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt) 

    samplerButton.player.connect(volNode);  //  connect to ouput
    mic.connect(samplerButton.recorder);    //  connect user microphone to sampler button for recording

    //  STOCK SAMPLES
    sample1Button = createButton('SAMPLE 1');
    sample1Button.position(samp1ButX, recButY);
    sample1Button.size(recButWd, recButHt);
    sample1Button.mousePressed(triggerSample1);
    sample1Signal = new SignalCircle(((samp1ButX) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);

    sample2Button = createButton('SAMPLE 2');
    sample2Button.position(samp2ButX, recButY);
    sample2Button.size(recButWd, recButHt);
    sample2Button.mousePressed(triggerSample2);
    sample2Signal = new SignalCircle(((samp2ButX) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);

    sample3Button = createButton('SAMPLE 3');
    sample3Button.position(samp3ButX, recButY);
    sample3Button.size(recButWd, recButHt);
    sample3Button.mousePressed(triggerSample3);
    sample3Signal = new SignalCircle(((samp3ButX) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);

    sample4Button = createButton('SAMPLE 4');
    sample4Button.position(samp4ButX, recButY);
    sample4Button.size(recButWd, recButHt);
    sample4Button.mousePressed(triggerSample4);
    sample4Signal = new SignalCircle(((samp4ButX) + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);

    //  TEST TONE OSCILLATOR BUTTON
    testToneButton = createButton('TEST TONE');
    testToneButton.position(recButX, soundVizY - (0.5 * soundVizHt));
    testToneButton.size(recButWd, recButHt);
    testToneButton.mousePressed(triggerTestTone);

    testTone = new Tone.Oscillator(200, 'sine').connect(volNode);   //  test tone

    ampModLFO = new Tone.LFO(1, -100, 0);   //  set up Tone LFO for amplitude modulation
    ampModLFO.phase = 90;   //  this line of code is essential for connecting a Tone.js LFO to a volume node WITHOUT getting interference, even if LFO is not active
    ampModLFO.connect(volNode.volume);  //  connect LFO to volume node

    ampModButton = createButton('ACTIVATE\nAMP MOD');   //  set up amp mod button
    ampModButton.position((0.67 * w), recButY);
    ampModButton.size(recButWd, recButHt);
    ampModButton.mousePressed(triggerAmpMod);

    lfoFreqSlider = createSlider(0.1, 20, 2, 0.1);      //  amp mod freq slider
    lfoFreqSlider.size(sliderWd);
    lfoFreqSlider.position(0.2 * w, 0.36 * h);
    lfoFreqSlider.hide();

    scope = new OscScope(soundVizX, soundVizY, soundVizWd, soundVizHt, 2048, 1024, false);    //  initialize oscilloscope 
    volNode.connect(scope.wave); //  connect volume node out to oscilloscope
    volNode.connect(scope.fft); //  connect to FFT object

    lfoViz = new LFOVisualizer(lfoVizRectX, lfoVizRectY, lfoVizRectWd, lfoVizRectHt, 100, 150, 200);    //  initialize lfo visualizer
    ampModLFO.connect(lfoViz.wave);     //  connect amp mod lfo to visualizer

    //  switch between amplitude and fft based visualization
    fftButton = createButton('CHANGE SCOPE TYPE');
    fftButton.position(0.79 * w, soundVizY + (0.5 * soundVizHt) - recButHt);
    fftButton.size(0.5 * recButWd, recButHt);
    fftButton.mousePressed(() => {
        scope.fftActive = scope.fftActive ? scope.fftActive = false : scope.fftActive = true;
    })

    linkBackward = createA('https://cpmdude89.github.io/playingInTheWaves/TourPlayRate.html', 'PREVIOUS TOUR STOP');
    linkBackward.position(0.05 * w, 0.04 * h);
    linkBackward.style('font-size', '1.5vw');
    
    linkForward = createA('https://cpmdude89.github.io/playingInTheWaves/TourDelay.html', 'NEXT TOUR STOP');
    linkForward.position(0.8 * w, 0.04 * h);
    linkForward.style('font-size', '1.5vw');

    pageRecorder = new PageRecorder(pageRecButX, pageRecButY, pageRecButWd, recButHt);
    limiter.connect(pageRecorder.recorder);
    pageRecorderSignal = new SignalCircle(pageRecButX + (0.5 * pageRecButWd), pageRecButY - (0.5 * recButHt), 0.4 * recButHt);

    Tone.Transport.start();     //  start Tone.Transport to set up events
}

function draw() {
    textOutput();
    background(0, 150, 80);     // nice shade of forest green

    noStroke();     //  set up page title
    textAlign(CENTER);  
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nAmplitude Modulation', 0.5 * w, 0.05 * h); //  page title

        //  signal circles
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

    if (testToneActive) {   //  signal light for test tone
        fill(0, 0, 255);    //  blue
        circle(((0.06 * w) + (0.5 * recButWd)), soundVizY - (0.55 * soundVizHt), 0.4 * recButHt);
        textSize(30);
        fill(0)
        text('Test Tone wave type is:\n' + testTone.type, 0.11 * w, 0.92 * soundVizY);
        
        //  test tone volume warning
        fill(220, 0, 50);
        stroke(0);
        strokeWeight(2);
        textSize(30);
        text('WARNING:\n Different wave types are\nnaturally different volumes.\nStart with a low volume when\nchanging wave types!', 0.11 * w, 1.15 * soundVizY)
    }

    //  type of OscScope currently active
    if (scope.fftActive) {
        textSize(26);
        fill(0);
        text('FFT', 0.81 * w, soundVizY + (0.45 * soundVizHt) - recButHt);
    }
    else {
        textSize(26);
        fill(0);
        text('WAVEFORM', 0.82 * w, soundVizY + (0.45 * soundVizHt) - recButHt);
    }

    //  if amplitude modulation is engaged, enable changing modulating frequency and show lfo viz
    if (ampModActive) {     
        ampModLFO.frequency.rampTo(lfoFreqSlider.value(), 0.05);

        fill(0);
        noStroke();
        textSize(40);
        text('Amplitude modulation is at rate: ' + lfoFreqSlider.value() + ' Hz', 0.5 * w, 0.34 * h);

        lfoViz.process();  //  draw lfo visualizer
    }

    scope.process(); //  draw oscilloscope to visualize sound
}

//  stock sample functions
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

//  test tone function
function triggerTestTone() {
    if (!testToneActive) {
        testTone.start();
        testTone.volume.rampTo(-1, 0.1);

        testToneActive = true;

        testToneTypeButton = createButton('CHANGE WAVE');
        testToneTypeButton.position(0.06 * w, soundVizY - (0.5 * soundVizHt) + (1.2 * recButHt));
        testToneTypeButton.size(recButWd, recButHt);
        testToneTypeButton.mousePressed(() => {
            if (testTone.type == 'sine') {
                testTone.type = 'triangle';
            }
            else if (testTone.type == 'triangle') {
                testTone.type = 'sawtooth';
                testTone.volume.rampTo(-3, 0.1);
            }
            else if (testTone.type == 'sawtooth') {
                testTone.type = 'square';
                
            }
            else if (testTone.type == 'square') {
                testTone.type = 'sine';
                testTone.volume.rampTo(-1, 0.1);
            }
        });
    }

    else {
        testTone.volume.rampTo(-100, 0.1);
        testTone.stop("+0.05");

        testToneActive = false;
        testToneTypeButton.remove();
    }
}

function triggerAmpMod() {
    if (!ampModActive) {        //  trigger amp mod on all output
        volNode.volume.rampTo(-100, 0.05);      //  bring down gain of volume node to avoid clipping

        ampModLFO.start();      //  activate LFO to modulate volume

        lfoFreqSlider.show();
        ampModActive = true;    //  flip button boolean

        freqButton = createButton('SWITCH TO HIGH FREQ');
        freqButton.position((0.67 * w), recButY - (0.8 * recButHt));
        freqButton.size(recButWd, 0.7 * recButHt);
        freqButton.mousePressed(() => {
            if (!ampModHighFreq) {
                freqButton.html('SWITCH TO LOW FREQ');
                lfoFreqSlider.remove();
                lfoFreqSlider = createSlider(1, 500, 50, 0.1);      //  amp mod freq slider
                lfoFreqSlider.size(sliderWd);
                lfoFreqSlider.position(0.2 * w, 0.36 * h);
                ampModHighFreq = true;
            }
            else {
                freqButton.html('SWITCH TO HIGH FREQ');
                lfoFreqSlider.remove();
                lfoFreqSlider = createSlider(0.1, 20, 2, 0.1);      //  amp mod freq slider
                lfoFreqSlider.size(sliderWd);
                lfoFreqSlider.position(0.2 * w, 0.36 * h);
                ampModHighFreq = false;
            }
        })
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