let w=window.innerWidth, h=window.innerHeight;
let recButX = w * 0.7, recButY = 0.2 * h, recButWd = 0.1 * w, recButHt = 0.08 * h;
let pageRecButX = w * 0.86, pageRecButY = 0.08 * h, pageRecButWd=0.65 * recButWd;
let mic;
let sampler1, sampler2, sampler3;
let controls1, controls2, controls3;
let limiter, volNode1, volNode2, volNode3, effectBus;
let longSample1
let volSlider1, volSlider2, volSlider3;
let reverb;
let YDepth, XFreq;
let tourLink, homepageLink;
let testSlider;
let pageRecorder;

//  set up volume nodes
function preload() {
    limiter = new Tone.Limiter(-1).toDestination();

    reverb = new Tone.Reverb(4).toDestination();

    volNode1 = new Tone.Volume(-6).connect(limiter);    //  track 1
    volNode2 = new Tone.Volume(-6).connect(limiter);    //  track 2
    volNode3 = new Tone.Volume(-6).connect(limiter);    //  track 3

    effectBus = new Tone.Volume(-4).connect(limiter);
}

function setup() {
    frameRate(30);  //  reduce draw() frame rate to save power

    canv = createCanvas(w, h);

    mic = new Tone.UserMedia();     //  set up input source from device to record
    mic.open();

    //  SamplerButtons to record and playback user input
    sampler1 = new SamplerButton(recButX, recButY, recButWd, recButHt);     
    sampler2 = new SamplerButton(recButX, 2.25 * recButY, recButWd, recButHt);  
    sampler3 = new SamplerButton(recButX, 3.5 * recButY, recButWd, recButHt);   

    //  connect each track with its volume node and input source
    sampler1.player.connect(volNode1);  
    mic.connect(sampler1.recorder);
    
    sampler2.player.connect(volNode1);
    mic.connect(sampler2.recorder);

    sampler3.player.connect(volNode1);
    mic.connect(sampler3.recorder);
    
    //  track 1 effects and buttons
    controls1 = new PlaygroundControls(recButX, recButY, recButWd, recButHt, sampler1.player, volNode1, reverb, 1.2);
    controls1.connectToBus(effectBus); 

    //  track 2 effects and buttons, plus new presets
    controls2 = new PlaygroundControls(recButX, 2.25 * recButY, recButWd, recButHt, sampler2.player, volNode2, reverb, 10);
    controls2.connectToBus(effectBus);

    controls2.delay.delayTime.value = 0.5;
    controls2.delayTimeLFO.frequency.value = 0.08;
    controls2.delayTimeLFO.min = 0.05;
    controls2.delayTimeLFO.max = 0.7;
    controls2.ampModLFOModulator.frequency.value = 0.04;
    controls2.ampModLFOModulator.min = 1;
    controls2.ampModLFOModulator.max = 300;
    controls2.filterSweep.frequency.value = 10;
    controls2.filterSweep.octaves = 4.5;
    controls2.filterSweep.filter.Q.value = 4;
    controls2.pannerFreqLFO.frequency.value = 0.5;
    controls2.pannerFreqLFO.min = 0.5;
    controls2.pannerFreqLFO.max = 30;

    //  track 3 effect buttons and new default presets
    controls3 = new PlaygroundControls(recButX, 3.5 * recButY, recButWd, recButHt, sampler3.player, volNode3, reverb, 15);
    controls3.connectToBus(effectBus);

    controls3.delay.delayTime.value = 0.5;
    controls3.delay.feedback.value = 0.5;
    controls3.delayTimeLFO.frequency.value = 0.01;
    controls3.delayTimeLFO.min = 0.04;
    controls3.delayTimeLFO.max = 1;
    controls3.ampModLFOModulator.frequency.value = 0.05;
    controls3.ampModLFOModulator.min = 2;
    controls3.ampModLFOModulator.max = 150;
    controls3.filterSweep.frequency.value = 15;
    controls3.filterSweep.baseFrequency = 100
    controls3.filterSweep.octaves = 5;
    controls3.filterSweep.filter.Q.value = 7;
    controls3.pannerFreqLFO.frequency.value = 1;
    controls3.pannerFreqLFO.min = 0.08;
    controls3.pannerFreqLFO.max = 2;
    controls3.panner.depth.value = 1;

    sampler1Signal = new SignalCircle(recButX + (0.5 * recButWd), recButY - (0.5 * recButHt), 0.4 * recButHt);
    sampler2Signal = new SignalCircle(recButX + (0.5 * recButWd), 2.25 * recButY - (0.5 * recButHt), 0.4 * recButHt);
    sampler3Signal = new SignalCircle(recButX + (0.5 * recButWd), 3.5 * recButY - (0.5 * recButHt), 0.4 * recButHt);

    // -------- STOCK SAMPLE BUTTONS -------- //
    shortSample1Button = createButton('SAMPLE 1');
    shortSample1Button.position(recButX, (recButY) + 1.7 * recButHt);
    shortSample1Button.size(0.75 * recButWd, 0.75 * recButHt);
    shortSample1Button.mousePressed(triggerShortSample1) 

    shortSample2Button = createButton('SAMPLE 2');
    shortSample2Button.position(recButX * 0.85, (recButY) + 1.7 * recButHt);
    shortSample2Button.size(0.75 * recButWd, 0.75 * recButHt);
    shortSample2Button.mousePressed(triggerShortSample2);

    shortSample3Button = createButton('SAMPLE 3');
    shortSample3Button.position(recButX * 0.7, (recButY) + 1.7 * recButHt);
    shortSample3Button.size(0.75 * recButWd, 0.75 * recButHt);
    shortSample3Button.mousePressed(triggerShortSample3) 

    shortSample4Button = createButton('SAMPLE 4');
    shortSample4Button.position(recButX * 0.55, (recButY) + 1.7 * recButHt);
    shortSample4Button.size(0.75 * recButWd, 0.75 * recButHt);
    shortSample4Button.mousePressed(triggerShortSample4);

    shortSample5Button = createButton('SAMPLE 5');
    shortSample5Button.position(recButX * 0.4, (recButY) + 1.7 * recButHt);
    shortSample5Button.size(0.75 * recButWd, 0.75 * recButHt);
    shortSample5Button.mousePressed(triggerShortSample5);

    mediumSample1Button = createButton('SAMPLE 1');
    mediumSample1Button.position(recButX, (2.25 * recButY) + 1.7 * recButHt);
    mediumSample1Button.size(0.75 * recButWd, 0.75 * recButHt);
    mediumSample1Button.mousePressed(triggerMediumSample1);

    mediumSample2Button = createButton('SAMPLE 2');
    mediumSample2Button.position(recButX * 0.85, (2.25 * recButY) + 1.7 * recButHt);
    mediumSample2Button.size(0.75 * recButWd, 0.75 * recButHt);
    mediumSample2Button.mousePressed(triggerMediumSample2);

    mediumSample3Button = createButton('SAMPLE 3');
    mediumSample3Button.position(recButX * 0.7, (2.25 * recButY) + 1.7 * recButHt);
    mediumSample3Button.size(0.75 * recButWd, 0.75 * recButHt);
    mediumSample3Button.mousePressed(triggerMediumSample3);

    mediumSample4Button = createButton('SAMPLE 4');
    mediumSample4Button.position(recButX * 0.55, (2.25 * recButY) + 1.7 * recButHt);
    mediumSample4Button.size(0.75 * recButWd, 0.75 * recButHt);
    mediumSample4Button.mousePressed(triggerMediumSample4);

    mediumSample5Button = createButton('SAMPLE 5');
    mediumSample5Button.position(recButX * 0.4, (2.25 * recButY) + 1.7 * recButHt);
    mediumSample5Button.size(0.75 * recButWd, 0.75 * recButHt);
    mediumSample5Button.mousePressed(triggerMediumSample5);
        
    longSample1Button = createButton('LONG SAMPLE 1');
    longSample1Button.position(recButX, (3.5 * recButY) + 1.7 * recButHt);
    longSample1Button.size(0.75 * recButWd, 0.75 * recButHt);
    longSample1Button.mousePressed(triggerlongSample1);

    longSample2Button = createButton('LONG SAMPLE 1');
    longSample2Button.position(recButX * 0.85, (3.5 * recButY) + 1.7 * recButHt);
    longSample2Button.size(0.75 * recButWd, 0.75 * recButHt);
    longSample2Button.mousePressed(triggerLongSample2);

    longSample3Button = createButton('SAMPLE 3');
    longSample3Button.position(recButX * 0.7, (3.5 * recButY) + 1.7 * recButHt);
    longSample3Button.size(0.75 * recButWd, 0.75 * recButHt);
    longSample3Button.mousePressed(triggerlongSample3);

    longSample4Button = createButton('SAMPLE 4');
    longSample4Button.position(recButX * 0.55, (3.5 * recButY) + 1.7 * recButHt);
    longSample4Button.size(0.75 * recButWd, 0.75 * recButHt);
    longSample4Button.mousePressed(triggerLongSample4);

    longSample5Button = createButton('SAMPLE 5');
    longSample5Button.position(recButX * 0.4, (3.5 * recButY) + 1.7 * recButHt);
    longSample5Button.size(0.75 * recButWd, 0.75 * recButHt);
    longSample5Button.mousePressed(triggerLongSample5);
    // -------- END STOCK SAMPLE BUTTONS -------- //

    //  track volume controls
    volSlider1 = createSlider(-20, 0, -6, 0.5);
    volSlider1.position(w * 0.01, recButY);
    volSlider1.size(0.1 * w, 0.05 * h);

    volSlider2 = createSlider(-20, 0, -6, 0.5);
    volSlider2.position(w * 0.01, recButY * 2.25);
    volSlider2.size(0.1 * w, 0.05 * h);

    volSlider3 = createSlider(-20, 0, -6, 0.5);
    volSlider3.position(w * 0.01, recButY * 3.5);
    volSlider3.size(0.1 * w, 0.05 * h);

    //  navigational links
    tourLink = createA('https://cpmdude89.github.io/playingInTheWaves/TourPlayRate.html', 'TAKE THE TOUR');
    tourLink.position(0.05 * w, 0.04 * h);
    tourLink.style('font-size', '1.5vw');

    homepageLink = createA('https://cpmdude89.github.io/playingInTheWaves/playingInTheWaves.html', 'BACK TO HOMEPAGE');
    homepageLink.position(0.8 * w, 0.04 * h);
    homepageLink.style('font-size', '1.5vw');

    //  page recorder to save page audio output
    pageRecorder = new PageRecorder(pageRecButX, pageRecButY, pageRecButWd, recButHt);
    limiter.connect(pageRecorder.recorder);
    pageRecorderSignal = new SignalCircle(pageRecButX + 0.5*(0.65 * recButWd), pageRecButY - (0.5 * recButHt), 0.4 * recButHt);

    Tone.Transport.start();
}

function draw() {
    textOutput();
    background(0, 150, 80);

    noStroke();
    textAlign(CENTER);
    fill(0);
    textSize(40);
    text('Playing In The Waves: Playground', 0.5 * w, 0.1 * h);

    //  suggested track lengths
    textAlign(LEFT);
    textSize(25)
    text('--SHORT LOOP--\n2 SECONDS OR LESS', 0.82 * w, recButY + (0.5 * recButHt));
    text('--MEDIUM LOOP--\n5 SECONDS OR LESS', 0.82 * w, 2.25 * recButY + (0.5 * recButHt));
    text('--LONG LOOP--\n10 SECONDS OR LESS', 0.82 * w, 3.5 * recButY + (0.5 * recButHt));

    //  signal circles
    if (sampler1.state == 'recording') {
        sampler1Signal.drawRecordingCircle();
    }

    if (sampler2.state == 'recording') {
        sampler2Signal.drawRecordingCircle();
    }

    if (sampler3.state == 'recording') {
        sampler3Signal.drawRecordingCircle();
    }

    if (sampler1.player.state == 'started') {
        sampler1Signal.drawActiveCircle();
    }

    if (sampler2.player.state == 'started') {
        sampler2Signal.drawActiveCircle();
    }

    if (sampler3.player.state == 'started') {
        sampler3Signal.drawActiveCircle();
    }

    if (pageRecorder.state == 'recording') {
        pageRecorderSignal.drawRecordingCircle();
    }

    //  check each effect rack for drawing signal circles and track effect parameters
    controls1.checkForActivity();
    controls2.checkForActivity();
    controls3.checkForActivity();

    //  track volume control
    sampler1.player.volume.value = volSlider1.value();
    sampler2.player.volume.value = volSlider2.value();
    sampler3.player.volume.value = volSlider3.value();

    noStroke();
    textSize(16);
    fill(0);
    text('TRACK 1 VOLUME', w * 0.015, recButY * 0.95);
    text('TRACK 2 VOLUME', w * 0.015, recButY * 2.23);    
    text('TRACK 3 VOLUME', w * 0.015, recButY * 3.3);    
}

//  if any key is pressed down
function keyPressed() {
    //  if spacebar is pressed
    //  this handles freezing the effect parameters in place
    if (keyCode == 32) {
        if (controls1.delayParamTrackActive && !controls1.delayFrozen) {
            controls1.freezeDelay(mouseX, mouseY);
            controls1.delayFrozen = true;
        }

        if (controls1.ampModParamTrackActive && !controls1.ampModFrozen) {
            controls1.freezeAmpMod(mouseX, mouseY);
            controls1.ampModFrozen = true;
        }

        if (controls1.filterSweepActive && !controls1.filterSweepFrozen) {
            controls1.freezeFilterSweep(mouseX, mouseY);
            controls1.filterSweepFrozen = true;
        }

        if (controls1.freqShifterParamTrackActive && !controls1.freqShifterFrozen) {
            controls1.freezeFreqShifter(mouseX, mouseY);
            controls1.freqShifterFrozen = true;
        }

        if (controls1.playbackRateParamTrackActive && !controls1.playbackRateFrozen) {
            controls1.freezePlaybackRate(mouseX, mouseY);
            controls1.playbackRateFrozen = true;
        }

        if (controls1.pannerParamTrack && !controls1.pannerFrozen) {
            controls1.freezePanner(mouseX, mouseY);
            controls1.pannerFrozen = true;
        }

        if (controls2.delayParamTrackActive && !controls2.delayFrozen) {
            controls2.freezeDelay(mouseX, mouseY);
            controls2.delayFrozen = true;
        }

        if (controls2.ampModParamTrackActive && !controls2.ampModFrozen) {
            controls2.freezeAmpMod(mouseX, mouseY);
            controls2.ampModFrozen = true;
        }

        if (controls2.filterSweepActive && !controls2.filterSweepFrozen) {
            controls2.freezeFilterSweep(mouseX, mouseY);
            controls2.filterSweepFrozen = true;
        }

        if (controls2.freqShifterParamTrackActive && !controls2.freqShifterFrozen) {
            controls2.freezeFreqShifter(mouseX, mouseY);
            controls2.freqShifterFrozen = true;
        }

        if (controls2.playbackRateParamTrackActive && !controls2.playbackRateFrozen) {
            controls2.freezePlaybackRate(mouseX, mouseY);
            controls2.playbackRateFrozen = true;
        }

        if (controls2.pannerParamTrack && !controls2.pannerFrozen) {
            controls2.freezePanner(mouseX, mouseY);
            controls2.pannerFrozen = true;
        }

        if (controls3.delayParamTrackActive && !controls3.delayFrozen) {
            controls3.freezeDelay(mouseX, mouseY);
            controls3.delayFrozen = true;
        }

        if (controls3.ampModParamTrackActive && !controls3.ampModFrozen) {
            controls3.freezeAmpMod(mouseX, mouseY);
            controls3.ampModFrozen = true;
        }

        if (controls3.filterSweepActive && !controls3.filterSweepFrozen) {
            controls3.freezeFilterSweep(mouseX, mouseY);
            controls3.filterSweepFrozen = true;
        }

        if (controls3.freqShifterParamTrackActive && !controls3.freqShifterFrozen) {
            controls3.freezeFreqShifter(mouseX, mouseY);
            controls3.freqShifterFrozen = true;
        }

        if (controls3.playbackRateParamTrackActive && !controls3.playbackRateFrozen) {
            controls3.freezePlaybackRate(mouseX, mouseY);
            controls3.playbackRateFrozen = true;
        }

        if (controls3.pannerParamTrack && !controls3.pannerFrozen) {
            controls3.freezePanner(mouseX, mouseY);
            controls3.pannerFrozen = true;
        }
    }
}



//===================================================================================================================================================//
//===================================================================================================================================================//
//  TRACK BY TRACK EFFECT BY EFFECT PARAMETER MOUSE-ON-SCREEN TRACKING
//  sorry this section is so long

function mousePressed() {
    //  check if clicked on Track 1 Delay Signal Circle
    if ((dist(mouseX, mouseY, controls1.delaySignal.x_coordinate, controls1.delaySignal.y_coordinate) < 
    (0.5 * controls1.delaySignal.diameter) && controls1.delayActive)) {   
        controls1.delayFrozen = false;
        
        if (!controls1.delayParamTrackActive) {
            controls1.delayParamTrackActive = true;
            controls1.delayTimeLFO.stop();
        }
        else if (controls1.delayParamTrackActive && !controls1.delayParamTrackActive_Y) {
            controls1.delayParamTrackActive_Y = true;
        }
        else if (controls1.delayParamTrackActive && controls1.delayParamTrackActive_Y) {
            controls1.delayParamTrackActive = false;
            controls1.delayParamTrackActive_Y = false;
            controls1.delayTimeLFO.start();
        }
    }

    //  check if clicked on Track 1 Amp Mod Signal Circle
    if ((dist(mouseX, mouseY, controls1.ampModSignal.x_coordinate, controls1.ampModSignal.y_coordinate) < 
    (0.5 * controls1.ampModSignal.diameter) && controls1.ampModActive)) {
        controls1.ampModFrozen = false;

        if (!controls1.ampModParamTrackActive) {
            controls1.ampModParamTrackActive = true;

            controls1.ampModLFO.stop();
            controls1.ampModLFO.phase = 90;

            controls1.ampModLFOParamTrack.start();
            controls1.ampModLFOParamTrack.amplitude.rampTo(1, 0.1);
        }
        else if (controls1.ampModParamTrackActive && !controls1.ampModParamTrackActive_Y) {
            controls1.ampModParamTrackActive_Y = true;
        }
        else if (controls1.ampModParamTrackActive && controls1.ampModParamTrackActive_Y) {
            controls1.ampModParamTrackActive = false;
            controls1.ampModParamTrackActive_Y = false;
            
            controls1.ampModLFOParamTrack.stop();
            controls1.ampModLFOParamTrack.phase = 90;

            controls1.ampModLFO.start();
        }
    }

    //  check if clicked on Track 1 Filter Sweep Signal Circle
    if ((dist(mouseX, mouseY, controls1.filterSweepSignal.x_coordinate, controls1.filterSweepSignal.y_coordinate) < 
    (0.5 * controls1.filterSweepSignal.diameter) && controls1.filterSweepActive)) {
        controls1.filterSweepFrozen = false;

        if (!controls1.filterSweepParamTrackActive) {
            controls1.filterSweepParamTrackActive = true;
        }
        else if (controls1.filterSweepParamTrackActive && !controls1.filterSweepParamTrackActive_Y) {
            controls1.filterSweepParamTrackActive_Y = true;
        }
        else if (controls1.filterSweepParamTrackActive && controls1.filterSweepParamTrackActive_Y) {
            controls1.filterSweepParamTrackActive = false;
            controls1.filterSweepParamTrackActive_Y = false;

            controls1.filterSweep.frequency.value = 1.2;
        }
    }

    //  check if clicked on Track 1 Frequency Shifter Signal Circle
    if ((dist(mouseX, mouseY, controls1.freqShifterSignal.x_coordinate, controls1.freqShifterSignal.y_coordinate) < 
    (0.5 * controls1.freqShifterSignal.diameter) && controls1.freqShifterActive)) {
        controls1.freqShifterFrozen = false;

        if (!controls1.freqShifterParamTrackActive) {
            controls1.freqShifterParamTrackActive = true;
            //controls1.freqShifter.wet.rampTo(0, 0.1);
            //controls1.freqShifterParamTrack.wet.rampTo(1, 0.1);
        }
        else if (controls1.freqShifterParamTrackActive && !controls1.freqShifterParamTrackActive_Y) {
            controls1.freqShifterParamTrackActive_Y = true;
        }

        else if (controls1.freqShifterParamTrackActive && controls1.freqShifterParamTrackActive_Y) {
            controls1.freqShifterParamTrackActive = false;
            controls1.freqShifterParamTrackActive_Y = false;

            //controls1.freqShifter.wet.rampTo(1, 0.1);
            //controls1.freqShifterParamTrack.wet.rampTo(0, 0.1);
        }
    }

    //  check if clicked on Track 1 Playback Rate Signal Circle
    if ((dist(mouseX, mouseY, controls1.playbackRateSignal.x_coordinate, controls1.playbackRateSignal.y_coordinate) < 
    (0.5 * controls1.playbackRateSignal.diameter) && controls1.playbackRateActive)) {        
        controls1.playbackRateFrozen = false;

        if (!controls1.playbackRateParamTrackActive) {
            controls1.playbackRateParamTrackActive = true;
            controls1.playbackRateLoop.stop();
        }
        else if (controls1.playbackRateParamTrackActive && !controls1.playbackRateParamTrackActive_Y) {
            controls1.playbackRateParamTrackActive_Y = true;
        }
        else if (controls1.playbackRateParamTrackActive && controls1.playbackRateParamTrackActive_Y) {
            controls1.playbackRateParamTrackActive = false;
            controls1.playbackRateParamTrackActive_Y = false;

            controls1.playbackRateLoop.start();
            controls1.playbackRateIncrement = 0.01;
        }
    } 

    //  check if clicked on Track 1 Auto Panner Signal Circle
    if ((dist(mouseX, mouseY, controls1.pannerSignal.x_coordinate, controls1.pannerSignal.y_coordinate) < 
    (0.5 * controls1.pannerSignal.diameter) && controls1.pannerActive)) {
        controls1.pannerFrozen = false;
        
        if (!controls1.pannerParamTrackActive) {
            controls1.pannerParamTrackActive = true;

            controls1.panner.wet.rampTo(0, 0.1);
            controls1.pannerFreqLFO.stop();
            controls1.panner.stop();
            //controls1.player.disconnect(controls1.panner);

            controls1.player.connect(controls1.pannerParamTrack);
            controls1.pannerParamTrack.start();
            controls1.pannerParamTrack.wet.rampTo(1, 0.1);
        }
        else if (controls1.pannerParamTrackActive && !controls1.pannerParamTrackActive_Y) {
            controls1.pannerParamTrackActive_Y = true;
        }
        else if (controls1.pannerParamTrackActive && controls1.pannerParamTrackActive_Y) {
            controls1.pannerParamTrackActive = false;
            controls1.pannerParamTrackActive_Y = false;

            controls1.pannerParamTrack.wet.rampTo(0, 0.1);
            controls1.pannerParamTrack.stop();
            controls1.player.disconnect(controls1.pannerParamTrack);
            
            controls1.panner.start();
            //controls1.player.connect(controls1.panner);
            controls1.pannerFreqLFO.start();
            controls1.panner.wet.rampTo(1, 0.1);
        }
    }

    //  check if clicked on Track 2 Delay Signal Circle
    if ((dist(mouseX, mouseY, controls2.delaySignal.x_coordinate, controls2.delaySignal.y_coordinate) < 
    (0.5 * controls2.delaySignal.diameter) && controls2.delayActive)) {    
        controls2.delayFrozen = false;
        
        if (!controls2.delayParamTrackActive) {
            controls2.delayParamTrackActive = true;
            controls2.delayTimeLFO.stop();
        }
        else if (controls2.delayParamTrackActive && !controls2.delayParamTrackActive_Y) {
            controls2.delayParamTrackActive_Y = true;
            
        }
        else if (controls2.delayParamTrackActive && controls2.delayParamTrackActive_Y) {
            controls2.delayParamTrackActive = false;
            controls2.delayParamTrackActive_Y = false;
            controls2.delayTimeLFO.start();
        }
    }

    //  check if clicked on Track 2 Amp Mod Signal Circle
    if ((dist(mouseX, mouseY, controls2.ampModSignal.x_coordinate, controls2.ampModSignal.y_coordinate) < 
    (0.5 * controls2.ampModSignal.diameter) && controls2.ampModActive)) {
        controls2.ampModFrozen = false;

        if (!controls2.ampModParamTrackActive) {
            controls2.ampModParamTrackActive = true;

            controls2.ampModLFO.stop();
            controls2.ampModLFO.phase = 90;

            controls2.ampModLFOParamTrack.start();
            controls2.ampModLFOParamTrack.amplitude.rampTo(1, 0.1);
        }
        else if (controls2.ampModParamTrackActive && !controls2.ampModParamTrackActive_Y) {
            controls2.ampModParamTrackActive_Y = true;
        }
        else if (controls2.ampModParamTrackActive && controls2.ampModParamTrackActive_Y) {
            controls2.ampModParamTrackActive = false;
            controls2.ampModParamTrackActive_Y = false;
            
            controls2.ampModLFOParamTrack.stop();
            controls2.ampModLFOParamTrack.phase = 90;

            controls2.ampModLFO.start();
        }
    }

    //  check if clicked on Track 2 Filter Sweep Signal Circle
    if ((dist(mouseX, mouseY, controls2.filterSweepSignal.x_coordinate, controls2.filterSweepSignal.y_coordinate) < 
    (0.5 * controls2.filterSweepSignal.diameter) && controls2.filterSweepActive)) {
        controls2.filterSweepFrozen = false;

        if (!controls2.filterSweepParamTrackActive) {
            controls2.filterSweepParamTrackActive = true;
        }
        else if (controls2.filterSweepParamTrackActive && !controls2.filterSweepParamTrackActive_Y) {
            controls2.filterSweepParamTrackActive_Y = true;
        }
        else if (controls2.filterSweepParamTrackActive && controls2.filterSweepParamTrackActive_Y) {
            controls2.filterSweepParamTrackActive = false;
            controls2.filterSweepParamTrackActive_Y = false;

            controls2.filterSweep.frequency.value = 10;
        }
    }

    //  check if clicked on Track 2 Frequency Shifter Signal Circle
    if ((dist(mouseX, mouseY, controls2.freqShifterSignal.x_coordinate, controls2.freqShifterSignal.y_coordinate) < 
    (0.5 * controls2.freqShifterSignal.diameter) && controls2.freqShifterActive)) {
        controls2.freqShifterFrozen = false;

        if (!controls2.freqShifterParamTrackActive) {
            controls2.freqShifterParamTrackActive = true;
            //controls2.freqShifter.wet.rampTo(0, 0.1);
            //controls2.freqShifterParamTrack.wet.rampTo(1, 0.1);
        }
        else if (controls2.freqShifterParamTrackActive && !controls2.freqShifterParamTrackActive_Y) {
            controls2.freqShifterParamTrackActive_Y = true;
        }

        else if (controls2.freqShifterParamTrackActive && controls2.freqShifterParamTrackActive_Y) {
            controls2.freqShifterParamTrackActive = false;
            controls2.freqShifterParamTrackActive_Y = false;

            controls2.freqShifter.wet.rampTo(1, 0.1);
            controls2.freqShifterParamTrack.wet.rampTo(0, 0.1);
        }
    }

    //  check if clicked on Track 2 Playback Rate Signal Circle
    if ((dist(mouseX, mouseY, controls2.playbackRateSignal.x_coordinate, controls2.playbackRateSignal.y_coordinate) < 
    (0.5 * controls2.playbackRateSignal.diameter) && controls2.playbackRateActive)) {    
        controls2.playbackRateFrozen = false;
        
        if (!controls2.playbackRateParamTrackActive) {
            controls2.playbackRateParamTrackActive = true;
        }
        else if (controls2.playbackRateParamTrackActive && !controls2.playbackRateParamTrackActive_Y) {
            controls2.playbackRateParamTrackActive_Y = true;
        }
        else if (controls2.playbackRateParamTrackActive && controls2.playbackRateParamTrackActive_Y) {
            controls2.playbackRateParamTrackActive = false;
            controls2.playbackRateParamTrackActive_Y = false;

            controls2.playbackRateIncrement = 0.01;
        }
    } 

    //  check if clicked on Track 2 Auto Panner Signal Circle
    if ((dist(mouseX, mouseY, controls2.pannerSignal.x_coordinate, controls2.pannerSignal.y_coordinate) < 
    (0.5 * controls2.pannerSignal.diameter) && controls2.pannerActive)) {
        controls2.pannerFrozen = false;
        
        if (!controls2.pannerParamTrackActive) {
            controls2.pannerParamTrackActive = true;

            controls2.panner.wet.rampTo(0, 0.1);
            controls2.pannerFreqLFO.stop();
            controls2.panner.stop();
            //controls2.player.disconnect(controls2.panner);

            controls2.player.connect(controls2.pannerParamTrack);
            controls2.pannerParamTrack.start();
            controls2.pannerParamTrack.wet.rampTo(1, 0.1);
        }
        else if (controls2.pannerParamTrackActive && !controls2.pannerParamTrackActive_Y) {
            controls2.pannerParamTrackActive_Y = true;
        }
        else if (controls2.pannerParamTrackActive && controls2.pannerParamTrackActive_Y) {
            controls2.pannerParamTrackActive = false;
            controls2.pannerParamTrackActive_Y = false;

            controls2.pannerParamTrack.wet.rampTo(0, 0.1);
            controls2.pannerParamTrack.stop();
            controls2.player.disconnect(controls2.pannerParamTrack);
            
            controls2.panner.start();
            //controls2.player.connect(controls2.panner);
            controls2.pannerFreqLFO.start();
            controls2.panner.wet.rampTo(1, 0.1);
        }
    }

    //  check if clicked on Track 3 Delay Signal Circle
    if ((dist(mouseX, mouseY, controls3.delaySignal.x_coordinate, controls3.delaySignal.y_coordinate) < 
    (0.5 * controls3.delaySignal.diameter) && controls3.delayActive)) {
        controls3.delayFrozen = false;
        
        if (!controls3.delayParamTrackActive) {
            controls3.delayParamTrackActive = true;
            controls3.delayTimeLFO.stop();
        }
        else if (controls3.delayParamTrackActive && !controls3.delayParamTrackActive_Y) {
            controls3.delayParamTrackActive_Y = true;
            
        }
        else if (controls3.delayParamTrackActive && controls3.delayParamTrackActive_Y) {
            controls3.delayParamTrackActive = false;
            controls3.delayParamTrackActive_Y = false;
            controls3.delayTimeLFO.start();
        }
    }

    //  check if clicked on Track 3 Amp Mod Signal Circle
    if ((dist(mouseX, mouseY, controls3.ampModSignal.x_coordinate, controls3.ampModSignal.y_coordinate) < 
    (0.5 * controls3.ampModSignal.diameter) && controls3.ampModActive)) {
        controls3.ampModFrozen = false;

        if (!controls3.ampModParamTrackActive) {
            controls3.ampModParamTrackActive = true;

            controls3.ampModLFO.stop();
            controls3.ampModLFO.phase = 90;

            controls3.ampModLFOParamTrack.start();
            controls3.ampModLFOParamTrack.amplitude.rampTo(1, 0.1);
        }
        else if (controls3.ampModParamTrackActive && !controls3.ampModParamTrackActive_Y) {
            controls3.ampModParamTrackActive_Y = true;
        }
        else if (controls3.ampModParamTrackActive && controls3.ampModParamTrackActive_Y) {
            controls3.ampModParamTrackActive = false;
            controls3.ampModParamTrackActive_Y = false;
            
            controls3.ampModLFOParamTrack.stop();
            controls3.ampModLFOParamTrack.phase = 90;

            controls3.ampModLFO.start();
        }
    }

    //  check if clicked on Track 3 Filter Sweep Signal Circle
    if ((dist(mouseX, mouseY, controls3.filterSweepSignal.x_coordinate, controls3.filterSweepSignal.y_coordinate) < 
    (0.5 * controls3.filterSweepSignal.diameter) && controls3.filterSweepActive)) {
        controls3.filterSweepFrozen = false;

        if (!controls3.filterSweepParamTrackActive) {
            controls3.filterSweepParamTrackActive = true;
        }
        else if (controls3.filterSweepParamTrackActive && !controls3.filterSweepParamTrackActive_Y) {
            controls3.filterSweepParamTrackActive_Y = true;
        }
        else if (controls3.filterSweepParamTrackActive && controls3.filterSweepParamTrackActive_Y) {
            controls3.filterSweepParamTrackActive = false;
            controls3.filterSweepParamTrackActive_Y = false;

            controls3.filterSweep.frequency.value = 15;
        }
    }

    //  check if clicked on Track 3 Frequency Shifter Signal Circle
    if ((dist(mouseX, mouseY, controls3.freqShifterSignal.x_coordinate, controls3.freqShifterSignal.y_coordinate) < 
    (0.5 * controls3.freqShifterSignal.diameter) && controls3.freqShifterActive)) {
        controls3.freqShifterFrozen = false;

        if (!controls3.freqShifterParamTrackActive) {
            controls3.freqShifterParamTrackActive = true;
            //controls3.freqShifter.wet.rampTo(0, 0.1);
            //controls3.freqShifterParamTrack.wet.rampTo(1, 0.1);
        }
        else if (controls3.freqShifterParamTrackActive && !controls3.freqShifterParamTrackActive_Y) {
            controls3.freqShifterParamTrackActive_Y = true;
        }

        else if (controls3.freqShifterParamTrackActive && controls3.freqShifterParamTrackActive_Y) {
            controls3.freqShifterParamTrackActive = false;
            controls3.freqShifterParamTrackActive_Y = false;

            //controls3.freqShifter.wet.rampTo(1, 0.1);
            //controls3.freqShifterParamTrack.wet.rampTo(0, 0.1);
        }
    }

    //  check if clicked on Track 3 Playback Rate Signal Circle
    if ((dist(mouseX, mouseY, controls3.playbackRateSignal.x_coordinate, controls3.playbackRateSignal.y_coordinate) < 
    (0.5 * controls3.playbackRateSignal.diameter) && controls3.playbackRateActive)) {
        controls3.playbackRateFrozen = false;
        
        if (!controls3.playbackRateParamTrackActive) {
            controls3.playbackRateParamTrackActive = true;
        }
        else if (controls3.playbackRateParamTrackActive && !controls3.playbackRateParamTrackActive_Y) {
            controls3.playbackRateParamTrackActive_Y = true;
        }
        else if (controls3.playbackRateParamTrackActive && controls3.playbackRateParamTrackActive_Y) {
            controls3.playbackRateParamTrackActive = false;
            controls3.playbackRateParamTrackActive_Y = false;

            controls3.playbackRateIncrement = 0.01;
        }
    } 

    //  check if clicked on Track 3 Auto Panner Signal Circle
    if ((dist(mouseX, mouseY, controls3.pannerSignal.x_coordinate, controls3.pannerSignal.y_coordinate) < 
    (0.5 * controls3.pannerSignal.diameter) && controls3.pannerActive)) {
        controls3.pannerFrozen = false;
        
        if (!controls3.pannerParamTrackActive) {
            controls3.pannerParamTrackActive = true;

            controls3.panner.wet.rampTo(0, 0.1);
            controls3.pannerFreqLFO.stop();
            controls3.panner.stop();
            //controls3.player.disconnect(controls3.panner);

            controls3.player.connect(controls3.pannerParamTrack);
            controls3.pannerParamTrack.start();
            controls3.pannerParamTrack.wet.rampTo(1, 0.1);
        }
        else if (controls3.pannerParamTrackActive && !controls3.pannerParamTrackActive_Y) {
            controls3.pannerParamTrackActive_Y = true;
        }
        else if (controls3.pannerParamTrackActive && controls3.pannerParamTrackActive_Y) {
            controls3.pannerParamTrackActive = false;
            controls3.pannerParamTrackActive_Y = false;

            controls3.pannerParamTrack.wet.rampTo(0, 0.1);
            controls3.pannerParamTrack.stop();
            controls3.player.disconnect(controls3.pannerParamTrack);
            
            controls3.panner.start();
            //controls3.player.connect(controls3.panner);
            controls3.pannerFreqLFO.start();
            controls3.panner.wet.rampTo(1, 0.1);
        }
    }
}

//===================================================================================================================================================//
//===================================================================================================================================================//
//  END TRACK BY TRACK EFFECT BY EFFECT PARAMETER MOUSE-ON-SCREEN TRACKING ---- //

//  STOCK SAMPLE FUNCTIONS
//  ---- SHORT ---- //
function triggerShortSample1() {
    sampler1.player.load("./sounds/bassThump.wav");
    sampler1.button.html('PLAY SAMPLE 1');
    sampler1.sampleLoaded = true;
    sampler1.showControls();
    sampler1.state = 'play';
}

function triggerShortSample2() {
    sampler1.player.load("./sounds/carla3.wav");
    sampler1.button.html('PLAY SAMPLE 2');
    sampler1.sampleLoaded = true;
    sampler1.showControls();
    sampler1.state = 'play';
}

function triggerShortSample3() {
    sampler1.player.load("./sounds/martina_3.wav");
    sampler1.button.html('PLAY SAMPLE 3');
    sampler1.sampleLoaded = true;
    sampler1.showControls();
    sampler1.state = 'play';
}

function triggerShortSample4() {
    sampler1.player.load("./sounds/slinky_lazer_edit.wav");
    sampler1.button.html('PLAY SAMPLE 4');
    sampler1.sampleLoaded = true;
    sampler1.showControls();
    sampler1.state = 'play';
}

function triggerShortSample5() {
    sampler1.player.load("./sounds/rulerSlaps.wav");
    sampler1.button.html('PLAY SAMPLE 5');
    sampler1.sampleLoaded = true;
    sampler1.showControls();
    sampler1.state = 'play';
}

//  ---- MEDIUM ---- //
function triggerMediumSample1() {
    sampler2.player.load("./sounds/5thsDown.wav");
    sampler2.button.html('PLAY SAMPLE 1');
    sampler2.sampleLoaded = true;
    sampler2.showControls();
    sampler2.state = 'play';
}

function triggerMediumSample2() {
    sampler2.player.load("./sounds/birds_acaracle.wav");
    sampler2.button.html('PLAY SAMPLE 2');
    sampler2.sampleLoaded = true;
    sampler2.showControls();
    sampler2.state = 'play';
}

function triggerMediumSample3() {
    sampler2.player.load("./sounds/martina_2.wav");
    sampler2.button.html('PLAY SAMPLE 3');
    sampler2.sampleLoaded = true;
    sampler2.showControls();
    sampler2.state = 'play';
}

function triggerMediumSample4() {
    sampler2.player.load("./sounds/CD_jump.wav");
    sampler2.button.html('PLAY SAMPLE 4');
    sampler2.sampleLoaded = true;
    sampler2.showControls();
    sampler2.state = 'play';
}

function triggerMediumSample5() {
    sampler2.player.load("./sounds/bassHarmonics.wav");
    sampler2.button.html('PLAY SAMPLE 5');
    sampler2.sampleLoaded = true;
    sampler2.showControls();
    sampler2.state = 'play';
}

//  ---- LONG ---- //
function triggerlongSample1() {
    sampler3.player.load("./sounds/synth1.wav");
    sampler3.button.html('PLAY SAMPLE 1');
    sampler3.sampleLoaded = true;
    sampler3.showControls();
    sampler3.state = 'play';
}

function triggerLongSample2() {
    sampler3.player.load("./sounds/paper_glide.wav");
    sampler3.button.html('PLAY SAMPLE 2');
    sampler3.sampleLoaded = true;
    sampler3.showControls();
    sampler3.state = 'play';
}

function triggerlongSample3() {
    sampler3.player.load("./sounds/martina_1.wav");
    sampler3.button.html('PLAY SAMPLE 3');
    sampler3.sampleLoaded = true;
    sampler3.showControls();
    sampler3.state = 'play';
}

function triggerLongSample4() {
    sampler3.player.load("./sounds/waves.wav");
    sampler3.button.html('PLAY SAMPLE 4');
    sampler3.sampleLoaded = true;
    sampler3.showControls();
    sampler3.state = 'play';
}

function triggerLongSample5() {
    sampler3.player.load("./sounds/bassOrbit1.wav");
    sampler3.button.html('PLAY SAMPLE 5');
    sampler3.sampleLoaded = true;
    sampler3.showControls();
    sampler3.state = 'play';
}