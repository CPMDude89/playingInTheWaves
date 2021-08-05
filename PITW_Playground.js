let w=window.innerWidth, h=window.innerHeight;
let recButX = w * 0.7, recButY = 0.2 * h, recButWd = 0.1 * w, recButHt = 0.08 * h;
let mic;
let sampler1, sampler2, sampler3;
let controls1, controls2, controls3;
let limiter, volNode1, volNode2, volNode3, effectBus;
let longSample1
let volSlider1, volSlider2, volSlider3;
let reverb;
let YDepth, XFreq;
let tourLink;
let testSlider;

function preload() {
    limiter = new Tone.Limiter(-1).toDestination();

    reverb = new Tone.Reverb(4).toDestination();

    volNode1 = new Tone.Volume(-6).connect(limiter);
    volNode2 = new Tone.Volume(-6).connect(limiter);
    volNode3 = new Tone.Volume(-6).connect(limiter);

    effectBus = new Tone.Volume(-4).connect(limiter);
}

function setup() {
    frameRate(45);

    canv = createCanvas(w, h);

    mic = new Tone.UserMedia();
    mic.open();

    sampler1 = new SamplerButton(recButX, recButY, recButWd, recButHt);
    sampler2 = new SamplerButton(recButX, 2.25 * recButY, recButWd, recButHt);    
    sampler3 = new SamplerButton(recButX, 3.5 * recButY, recButWd, recButHt);

    sampler1.player.connect(volNode1);
    mic.connect(sampler1.recorder);
    
    sampler2.player.connect(volNode1);
    mic.connect(sampler2.recorder);

    sampler3.player.connect(volNode1);
    mic.connect(sampler3.recorder);
    
    controls1 = new PlaygroundControls(recButX, recButY, recButWd, recButHt, sampler1.player, volNode1, reverb, 1.2);
    controls1.connectToBus(effectBus);

    controls2 = new PlaygroundControls(recButX, 2.25 * recButY, recButWd, recButHt, sampler2.player, volNode2, reverb, 10);
    controls2.connectToBus(effectBus);

    controls2.delay.delayTime.value = 0.5;
    controls2.delayTimeLFO.frequency.value = 0.08;
    controls2.delayTimeLFO.min = 0.05;
    controls2.delayTimeLFO.max = 0.7;
    controls2.ampModLFOModulator.frequency.value = 0.04;
    controls2.ampModLFOModulator.min = 1;
    controls2.ampModLFOModulator.max = 300;
    //controls2.filterSweep.frequency.value = 10;
    controls2.filterSweep.octaves = 4.5;
    controls2.filterSweep.filter.Q.value = 4;
    controls2.freqShifterLFO.frequency.value = 0.05;
    controls2.freqShifterLFO.min = -500;
    controls2.freqShifterLFO.max = 400;
    //controls2.pannerFreqLFO.frequency.value = 0.1;
    controls2.pannerFreqLFO.frequency.value = 0.5;
    controls2.pannerFreqLFO.min = 0.5;
    //controls2.pannerFreqLFO.max = 3;
    controls2.pannerFreqLFO.max = 30;

    controls3 = new PlaygroundControls(recButX, 3.5 * recButY, recButWd, recButHt, sampler3.player, volNode3, reverb, 15);
    controls3.connectToBus(effectBus);

    controls3.delay.delayTime.value = 0.5;
    controls3.delay.feedback.value = 0.5;
    controls3.delayTimeLFO.frequency.value = 0.03;
    controls3.delayTimeLFO.min = 0.04;
    controls3.delayTimeLFO.max = 1;
    controls3.ampModLFOModulator.frequency.value = 0.05;
    controls3.ampModLFOModulator.min = 2;
    controls3.ampModLFOModulator.max = 250;
    //controls3.filterSweep.frequency.value = 15;
    controls3.filterSweep.baseFrequency = 100
    controls3.filterSweep.octaves = 5;
    controls3.filterSweep.filter.Q.value = 7;
    controls3.freqShifterLFO.frequency.value = 0.03;
    controls3.freqShifterLFO.min = -500;
    controls3.freqShifterLFO.max = 600;
    //controls3.pannerFreqLFO.frequency.value = 0.07;
    controls3.pannerFreqLFO.frequency.value = 1;
    controls3.pannerFreqLFO.min = 0.08;
    //controls3.pannerFreqLFO.max = 2;
    controls3.pannerFreqLFO.max = 50;
    controls3.panner.depth.value = 1;

    shortSample1Button = createButton('SHORT SAMPLE 1');
    shortSample1Button.position(recButX, (recButY) + 1.7 * recButHt);
    shortSample1Button.size(0.75 * recButWd, 0.75 * recButHt);
    shortSample1Button.mousePressed(() => {
        sampler1.player.load("./sounds/martina_3.wav");
        sampler1.button.html('PLAY SAMPLE 1');
        sampler1.sampleLoaded = true;
        sampler1.showControls();
        sampler1.state = 'play';
    })

    mediumSample1Button = createButton('MED SAMPLE 1');
    mediumSample1Button.position(recButX, (2.25 * recButY) + 1.7 * recButHt);
    mediumSample1Button.size(0.75 * recButWd, 0.75 * recButHt);
    mediumSample1Button.mousePressed(() => {
        sampler2.player.load("./sounds/martina_2.wav");
        sampler2.button.html('PLAY SAMPLE 1');
        sampler2.sampleLoaded = true;
        sampler2.showControls();
        sampler2.state = 'play';
    })

    longSample1Button = createButton('LONG SAMPLE 1');
    longSample1Button.position(recButX, (3.5 * recButY) + 1.7 * recButHt);
    longSample1Button.size(0.75 * recButWd, 0.75 * recButHt);
    longSample1Button.mousePressed(() => {
        sampler3.player.load("./sounds/martina_1.wav");
        sampler3.button.html('PLAY SAMPLE 1');
        sampler3.sampleLoaded = true;
        sampler3.showControls();
        sampler3.state = 'play';
    })

    tourLink = createA('https://cpmdude89.github.io/playingInTheWaves/TourPlayRate.html', 'TAKE THE TOUR');
    tourLink.position(0.05 * w, 0.05 * h);

    //testSlider = createSlider(1, 200, )

    Tone.Transport.start();
}

function draw() {
    background(0, 150, 80);

    noStroke();
    textAlign(CENTER);
    fill(0);
    textSize(40);
    text('Playing In The Waves: Playground', 0.5 * w, 0.1 * h);

    textAlign(LEFT);
    textSize(25)
    text('--SHORT LOOP--\n2 SECONDS OR LESS', 0.82 * w, recButY + (0.5 * recButHt));
    text('--MEDIUM LOOP--\n5 SECONDS OR LESS', 0.82 * w, 2.25 * recButY + (0.5 * recButHt));
    text('--LONG LOOP--\n10 SECONDS OR LESS', 0.82 * w, 3.5 * recButY + (0.5 * recButHt));

    if (sampler1.state == 'recording') {
        fill(255, 0, 0);
        circle(recButX + (0.5 * recButWd), recButY - (0.5 * recButHt), 0.4 * recButHt);
    }

    if (sampler2.state == 'recording') {
        fill(255, 0, 0);
        circle(recButX + (0.5 * recButWd), 2.25 * recButY - (0.5 * recButHt), 0.4 * recButHt);
    }

    if (sampler3.state == 'recording') {
        fill(255, 0, 0);
        circle(recButX + (0.5 * recButWd), 3.5 * recButY - (0.5 * recButHt), 0.4 * recButHt);
    }

    controls1.checkForActivity();
    controls2.checkForActivity();
    controls3.checkForActivity();


}



//===================================================================================================================================================//
//===================================================================================================================================================//


function mousePressed() {
    //  check if clicked on Track 1 Delay Signal Circle
    if ((dist(mouseX, mouseY, controls1.delaySignal.x_coordinate, controls1.delaySignal.y_coordinate) < 
    (0.5 * controls1.delaySignal.diameter) && controls1.delayActive)) {        
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
        //controls1.checkParamTracks();
    }

    //  check if clicked on Track 1 Amp Mod Signal Circle
    if ((dist(mouseX, mouseY, controls1.ampModSignal.x_coordinate, controls1.ampModSignal.y_coordinate) < 
    (0.5 * controls1.ampModSignal.diameter) && controls1.ampModActive)) {
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

        //controls1.checkParamTracks();
    }

    //  check if clicked on Track 1 Filter Sweep Signal Circle
    if ((dist(mouseX, mouseY, controls1.filterSweepSignal.x_coordinate, controls1.filterSweepSignal.y_coordinate) < 
    (0.5 * controls1.filterSweepSignal.diameter) && controls1.filterSweepActive)) {
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
        
        //controls1.checkParamTracks();
    }

    //  check if clicked on Track 1 Frequency Shifter Signal Circle
    if ((dist(mouseX, mouseY, controls1.freqShifterSignal.x_coordinate, controls1.freqShifterSignal.y_coordinate) < 
    (0.5 * controls1.freqShifterSignal.diameter) && controls1.freqShifterActive)) {
        if (!controls1.freqShifterParamTrackActive) {
            controls1.freqShifterParamTrackActive = true;
            controls1.freqShifter.wet.rampTo(0, 0.1);
            controls1.freqShifterParamTrack.wet.rampTo(1, 0.1);
        }
        else if (controls1.freqShifterParamTrackActive && !controls1.freqShifterParamTrackActive_Y) {
            controls1.freqShifterParamTrackActive_Y = true;
        }

        else if (controls1.freqShifterParamTrackActive && controls1.freqShifterParamTrackActive_Y) {
            controls1.freqShifterParamTrackActive = false;
            controls1.freqShifterParamTrackActive_Y = false;

            controls1.freqShifter.wet.rampTo(1, 0.1);
            controls1.freqShifterParamTrack.wet.rampTo(0, 0.1);
        }
        //controls1.checkParamTracks();
    }

    //  check if clicked on Track 1 Playback Rate Signal Circle
    if ((dist(mouseX, mouseY, controls1.playbackRateSignal.x_coordinate, controls1.playbackRateSignal.y_coordinate) < 
    (0.5 * controls1.playbackRateSignal.diameter) && controls1.playbackRateActive)) {        
        if (!controls1.playbackRateParamTrackActive) {
            controls1.playbackRateParamTrackActive = true;
        }
        else if (controls1.playbackRateParamTrackActive && !controls1.playbackRateParamTrackActive_Y) {
            controls1.playbackRateParamTrackActive_Y = true;
        }
        else if (controls1.playbackRateParamTrackActive && controls1.playbackRateParamTrackActive_Y) {
            controls1.playbackRateParamTrackActive = false;
            controls1.playbackRateParamTrackActive_Y = false;

            controls1.playbackRateIncrement = 0.01;
        }

        //controls1.checkParamTracks();
    } 

    //  check if clicked on Track 1 Auto Panner Signal Circle
    if ((dist(mouseX, mouseY, controls1.pannerSignal.x_coordinate, controls1.pannerSignal.y_coordinate) < 
    (0.5 * controls1.pannerSignal.diameter) && controls1.pannerActive)) {
        //controls1.pannerParamTrackActive = controls1.pannerParamTrackActive ? controls1.pannerParamTrackActive = false : controls1.pannerParamTrackActive = true;
        
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

        //controls1.checkParamTracks();
    }

    //  check if clicked on Track 2 Delay Signal Circle
    if ((dist(mouseX, mouseY, controls2.delaySignal.x_coordinate, controls2.delaySignal.y_coordinate) < 
    (0.5 * controls2.delaySignal.diameter) && controls2.delayActive)) {        
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
        //controls2.checkParamTracks();
    }

    //  check if clicked on Track 2 Amp Mod Signal Circle
    if ((dist(mouseX, mouseY, controls2.ampModSignal.x_coordinate, controls2.ampModSignal.y_coordinate) < 
    (0.5 * controls2.ampModSignal.diameter) && controls2.ampModActive)) {
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

        //controls2.checkParamTracks();
    }

    //  check if clicked on Track 2 Filter Sweep Signal Circle
    if ((dist(mouseX, mouseY, controls2.filterSweepSignal.x_coordinate, controls2.filterSweepSignal.y_coordinate) < 
    (0.5 * controls2.filterSweepSignal.diameter) && controls2.filterSweepActive)) {
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
        
        //controls2.checkParamTracks();
    }

    //  check if clicked on Track 2 Frequency Shifter Signal Circle
    if ((dist(mouseX, mouseY, controls2.freqShifterSignal.x_coordinate, controls2.freqShifterSignal.y_coordinate) < 
    (0.5 * controls2.freqShifterSignal.diameter) && controls2.freqShifterActive)) {
        if (!controls2.freqShifterParamTrackActive) {
            controls2.freqShifterParamTrackActive = true;
            controls2.freqShifter.wet.rampTo(0, 0.1);
            controls2.freqShifterParamTrack.wet.rampTo(1, 0.1);
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
        //controls2.checkParamTracks();
    }

    //  check if clicked on Track 2 Playback Rate Signal Circle
    if ((dist(mouseX, mouseY, controls2.playbackRateSignal.x_coordinate, controls2.playbackRateSignal.y_coordinate) < 
    (0.5 * controls2.playbackRateSignal.diameter) && controls2.playbackRateActive)) {        
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

        //controls2.checkParamTracks();
    } 

    //  check if clicked on Track 2 Auto Panner Signal Circle
    if ((dist(mouseX, mouseY, controls2.pannerSignal.x_coordinate, controls2.pannerSignal.y_coordinate) < 
    (0.5 * controls2.pannerSignal.diameter) && controls2.pannerActive)) {
        //controls2.pannerParamTrackActive = controls2.pannerParamTrackActive ? controls2.pannerParamTrackActive = false : controls2.pannerParamTrackActive = true;
        
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

        //controls2.checkParamTracks();
    }

    //  check if clicked on Track 3 Delay Signal Circle
    if ((dist(mouseX, mouseY, controls3.delaySignal.x_coordinate, controls3.delaySignal.y_coordinate) < 
    (0.5 * controls3.delaySignal.diameter) && controls3.delayActive)) {        
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
        //controls3.checkParamTracks();
    }

    //  check if clicked on Track 3 Amp Mod Signal Circle
    if ((dist(mouseX, mouseY, controls3.ampModSignal.x_coordinate, controls3.ampModSignal.y_coordinate) < 
    (0.5 * controls3.ampModSignal.diameter) && controls3.ampModActive)) {
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

        //controls3.checkParamTracks();
    }

    //  check if clicked on Track 3 Filter Sweep Signal Circle
    if ((dist(mouseX, mouseY, controls3.filterSweepSignal.x_coordinate, controls3.filterSweepSignal.y_coordinate) < 
    (0.5 * controls3.filterSweepSignal.diameter) && controls3.filterSweepActive)) {
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
        
        //controls3.checkParamTracks();
    }

    //  check if clicked on Track 3 Frequency Shifter Signal Circle
    if ((dist(mouseX, mouseY, controls3.freqShifterSignal.x_coordinate, controls3.freqShifterSignal.y_coordinate) < 
    (0.5 * controls3.freqShifterSignal.diameter) && controls3.freqShifterActive)) {
        if (!controls3.freqShifterParamTrackActive) {
            controls3.freqShifterParamTrackActive = true;
            controls3.freqShifter.wet.rampTo(0, 0.1);
            controls3.freqShifterParamTrack.wet.rampTo(1, 0.1);
        }
        else if (controls3.freqShifterParamTrackActive && !controls3.freqShifterParamTrackActive_Y) {
            controls3.freqShifterParamTrackActive_Y = true;
        }

        else if (controls3.freqShifterParamTrackActive && controls3.freqShifterParamTrackActive_Y) {
            controls3.freqShifterParamTrackActive = false;
            controls3.freqShifterParamTrackActive_Y = false;

            controls3.freqShifter.wet.rampTo(1, 0.1);
            controls3.freqShifterParamTrack.wet.rampTo(0, 0.1);
        }
        //controls3.checkParamTracks();
    }

    //  check if clicked on Track 3 Playback Rate Signal Circle
    if ((dist(mouseX, mouseY, controls3.playbackRateSignal.x_coordinate, controls3.playbackRateSignal.y_coordinate) < 
    (0.5 * controls3.playbackRateSignal.diameter) && controls3.playbackRateActive)) {        
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

        //controls3.checkParamTracks();
    } 

    //  check if clicked on Track 3 Auto Panner Signal Circle
    if ((dist(mouseX, mouseY, controls3.pannerSignal.x_coordinate, controls3.pannerSignal.y_coordinate) < 
    (0.5 * controls3.pannerSignal.diameter) && controls3.pannerActive)) {
        //controls3.pannerParamTrackActive = controls3.pannerParamTrackActive ? controls3.pannerParamTrackActive = false : controls3.pannerParamTrackActive = true;
        
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

        //controls3.checkParamTracks();
    }
}



