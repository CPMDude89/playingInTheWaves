let w = window.innerWidth;
let h = window.innerHeight;
let mic, recorder, soundFile1; 
let recorderButton1, recButtonWidth = w/12, recButtonHeight = h/12, recButtonX = 2.75 * (w/4), recButtonY = h/5;
let state1 = 0;
let playheadMonitor = 0, playheadActive = false;
let progBarWidth = w/6, progBarHeight = h/28, progBarX = 2.417 * (w/4), progBarY = 0.75 * h/5;
let loopingActive = false;
let loopButton, loopButtonX = 2.75 * (w/4), loopButtonY = 1.206 * (h/5), smallButtonWidth = w/12, smallButtonHeight = h/24;
let stopButton, stopButtonX = 2.417 * (w/4), stopButtonY = h/5, clearButton;
let ampLFO, ampLFOButton, ampLFOButtonX= 3.9 * (w/5), ampLFOButtonY= 0.85 * (h/5), ampLFOActive=false, ampLFOAnalyzer, lfoWave;
let ampModFreqSlider, ampModDepthSlider;
let lfoVizRectWidth=w/18, lfoVizRectHeight=h/1.6, rect1X = (w/18), rect1Y = 0.75 * (h/4);
let delay, delayButton, delayActive = false, delayButtonX = 3.15 * (w/6), delayButtonY = 1.103 * (h/5), 
    delayButtonWidth = (w/15), delayButtonHeight = h/25;
let delayTimeSlider, delayFeedbackSlider; 
let delayLFO, delayLFOButton, delayLFOActive=false, delayLFOViz=false, delayLFOFreqSlider, delayLFODepthSlider;
let ampModVizButton, ampModVizActive=false, delayLFOVizButton, delayLFOVizActive=false;
let filter, filterActive=false, filterButton, filterFreqSlider, filterResSlider, filterLFO, filterLFOVizActive=false, filterLFOVizButton,
    filterButtonX=2.7 * (w/4), filterButtonY=1.45 * (h/5), filterLFOFreqSlider, filterLFODepthSlider, filterLFOActive=false;
let reverb, reverbActive=false, reverbButton, reverbButtonX=3.9 * (w/5), reverbButtonY=1.103 * (h/5), 
    reverbTimeSlider, reverbDecaySlider;
let reverseReverbButton, reverbReverse=false;



// ======================================================== SETUP ======================================================== //
// ======================================================== SETUP ======================================================== //
function setup()
{
    createCanvas(w, h);

    mic = new p5.AudioIn(); //  get the soundRecorder input source ready
    mic.start();

    recorder = new p5.SoundRecorder();  //  connect input source to sound recorder
    recorder.setInput(mic);

    soundFile1 = new p5.SoundFile();    //  create audio object to store recorded audio
    
    recorderButton1 = createButton('RECORD');   //  record button
    recorderButton1.position(recButtonX, recButtonY);
    recorderButton1.size(recButtonWidth, recButtonHeight);
    recorderButton1.mousePressed(record1);

    ampLFO = new p5.Oscillator('sine'); //  audio effect LFO's
    delayLFO = new p5.Oscillator('sine');
    filterLFO = new p5.Oscillator('sine');
    
    createSliders() //  make control sliders and hide them

    ampLFOAnalyzer = new p5.FFT();  //  use fft objects to get a clear reading from LFO's
    delayLFOAnalyzer = new p5.FFT();
    filterLFOAnalyzer = new p5.FFT();
    
    delay = new p5.Delay(); //  delay
    delay.disconnect();

    filter = new p5.LowPass();  //  filter
    
    reverb = new p5.Reverb();   //  reverb
}
// ======================================================== DRAW ======================================================== //
// ======================================================== DRAW ======================================================== //
function draw()
{
    background(179, 179, 204);

    //  title
    fill(0);
    textSize(35);
    textAlign(CENTER)
    text("Playground 1st Draft: p5.sound Version", w/2, h / 20);

    //  labels
    textSize(16);
    text("LFO 1 Frequency", w/12, 1.05 * (h/8));
    text("LFO 1 Depth", w/12, 1.03 * (h/6));


    // bar fills as clip is played through
    if (playheadActive) {
        noFill();
        strokeWeight(2);
        rectMode(CORNER);
        rect(progBarX, progBarY, progBarWidth, progBarHeight); // draw prog bar borders

        //  fill progress bar 
        fill(113, 218, 113);    //  sage green
        playheadMonitor = map(soundFile1.currentTime(), 0, soundFile1.duration(), 0, progBarWidth);
        rect(progBarX, progBarY, playheadMonitor, progBarHeight);   //  draw prog bar filling
    }

    //  draw lfo visualizer
    rectMode(CORNER);
    fill(0);    //  black
    rect(rect1X, rect1Y, lfoVizRectWidth, lfoVizRectHeight);    //  lfo viz container

    fill(113, 218, 113);    //  sage green

    let r = 50  //  circle radius
    let min = (rect1Y + lfoVizRectHeight)-r;    //  bottom of container
    let max = rect1Y + r;   //  top of container


    if (ampModVizActive == true || delayLFOVizActive == true || filterLFOVizActive == true) {
        //  draw visualizer
        if (delayLFOVizActive) {    //  if drawing delay time LFO
            let lfoY = map(drawLFO1(), 0, 1, min, max);  // 
            circle(rect1X + (lfoVizRectWidth/2), (2*lfoY)-(0.8 * lfoVizRectHeight), r*2);    //  draw viz circle
        }
        else if (ampModVizActive) {  //  if drawing amp mod
            let lfoY = map(drawLFO1(), 0, 1, min, max);  //  
            circle(rect1X + (lfoVizRectWidth/2), lfoY, r*2);    //  draw viz circle
        }
        else if (filterLFOVizActive) {  //  if drawing filter freq LFO
            let lfoY = map(drawLFO1(), 0, 1, min, max);  
            circle(rect1X + (lfoVizRectWidth/2), lfoY, r*2);    //  draw viz circle
        }

        //  set slider values to lfo properties
        ampLFO.freq(ampModFreqSlider.value());
        ampLFO.amp(ampModDepthSlider.value(), 0.001);
        delayLFO.freq(delayLFOFreqSlider.value());
        delayLFO.amp(delayLFODepthSlider.value(), 0.001);
        filterLFO.freq(filterLFOFreqSlider.value(), 0.001);
        filterLFO.amp(filterLFODepthSlider.value(), 0.001);
    }

    if (ampLFOActive) { //  turn on amplitude modulation
        let waveform = ampLFOAnalyzer.waveform();
        let vol = map(waveform[0], -1, 1, 0, 1);
        soundFile1.setVolume(vol, 0.01);    //  set recording volume to output of LFO  
    }

    if (delayActive) {  //  turn on delay
        delay.feedback(delayFeedbackSlider.value());

        if (!delayLFOActive) {
            delay.delayTime(delayTimeSlider.value());
        }
    }    

    if (filterActive) { //  turn on filter
        filter.freq(filterFreqSlider.value());
        filter.res(filterResSlider.value());
    }

    if (filterLFOActive) {  //  turn on filter LFO
        let filterWaveform = filterLFOAnalyzer.waveform();
        let f = map(filterWaveform[0], -1, 1, 10, 5000);
        filter.freq(f);
    }
    
    if (reverbActive) {
        //reverb.set(reverbTimeSlider.value(), 2, false);
        //reverb.set(6, reverbTimeSlider, false);
        reverb.drywet(reverbTimeSlider.value());
    }
    

    
}

// ======================================================== END DRAW ======================================================== //
// ======================================================== END DRAW ======================================================== //

// -------- CUSTOM FUNCTIONS -------- //
function record1()
{
    //  make sure audio is good to go
    userStartAudio();
    //  make sure user has mic enabled
    if (state1 === 0 && mic.enabled) {
        //  record into p5.SoundFile after 80 milliseconds to get past mouse click
        setTimeout(function() {recorder.record(soundFile1, 10)}, 120);
        recorderButton1.html('RECORDING!')
        state1++;
    }
    else if(state1 === 1) {
        //  stop recorder and 
        //  send result to soundFile
        recorder.stop();
        setTimeout(function() {
            playheadActive = true;
            addLoopButton();
            addStopButton();
            addClearButton();
            addAmpModButton();
            addDelayButton();
            addFilterButton();
            addreverbButton();
            addLFOVizButtons();
        }, 100);
        recorderButton1.html('PLAY RECORDING');
        state1++;
    }
    else if (state1 === 2) {
        soundFile1.play();
        soundFile1.jump(0);
        playheadActive = soundFile1.isPlaying();
    }
}

function drawLFO1() {
    if (ampModVizActive) {  //  to control amplitude modulation
        lfoWave = ampLFOAnalyzer.waveform();
    }

    else if (delayLFOVizActive) {   //  to control delay time LFO 
        lfoWave = delayLFOAnalyzer.waveform();
    }

    else if (filterLFOVizActive) {  //  to control filter freq LFO
        lfoWave = filterLFOAnalyzer.waveform();
    }

    let out = map(lfoWave[0], -1, 1, 0, 1)  //  send a scaled signal out to draw()
    return out;
}

function addLFOVizButtons() {
    ampModVizButton = createButton('AMPLITUDE MODIFICATION');
    ampModVizButton.position(w/34, 4.1 * (h/5));

    delayLFOVizButton = createButton('DELAY TIME LFO');
    delayLFOVizButton.position(w/34, 4.25 * (h/5));

    filterLFOVizButton = createButton('FILTER FREQ LFO');
    filterLFOVizButton.position(w/34, 4.4 * (h/5));

    ampModVizButton.mousePressed(function() {
        if (!ampModVizActive) {
            ampModVizActive = true;
            delayLFOVizActive = false;
            ampModFreqSlider.show();
            ampModDepthSlider.show();
            delayLFOFreqSlider.hide();
            delayLFODepthSlider.hide();
            filterLFOFreqSlider.hide();
            filterLFODepthSlider.hide();
        }
        else {
            ampModVizActive = false;
        }
    })

    delayLFOVizButton.mousePressed(function() {
        if (!delayLFOVizActive) {
            delayLFOVizActive = true;
            ampModVizActive = false;
            delayLFOFreqSlider.show();
            delayLFODepthSlider.show();
            ampModFreqSlider.hide();
            ampModDepthSlider.hide();
            filterLFOFreqSlider.hide();
            filterLFODepthSlider.hide();
        }
        else {
            delayLFOVizActive = false;
        }
    })

    filterLFOVizButton.mousePressed(function () {
        if (!filterLFOVizActive) {
            filterLFOVizActive = true;
            delayLFOVizActive = false;
            ampModVizActive = false;
            filterLFOFreqSlider.show();
            filterLFODepthSlider.show();
            ampModFreqSlider.hide();
            ampModDepthSlider.hide();
            delayLFOFreqSlider.hide();
            delayLFODepthSlider.hide();
        }
        else {
            filterLFOVizActive = false;
        }
    })
}

function addLoopButton() {
    loopButton = createButton('ACTIVATE LOOPING');   //  activate loop
    loopButton.position(loopButtonX, loopButtonY);
    loopButton.size(smallButtonWidth, smallButtonHeight);

    recorderButton1.size(smallButtonWidth, smallButtonHeight);

    loopButton.mousePressed(function() {
        if (!soundFile1.isLooping()) {
            soundFile1.setLoop(true)
            soundFile1.play();
            soundFile1.jump(0);
            loopButton.html('DEACTIVATE LOOPING')
        }
        else {
            soundFile1.setLoop(false);
            loopButton.html('ACTIVATE LOOPING')
        }
    });
}

function addStopButton() {
    stopButton = createButton('STOP SAMPLE');
    stopButton.position(stopButtonX, stopButtonY);
    stopButton.size(smallButtonWidth, smallButtonHeight);
    stopButton.mousePressed(function() {soundFile1.stop()});
}

function addClearButton() {
    clearButton = createButton('CLEAR SAMPLE');
    clearButton.position(stopButtonX, loopButtonY);
    clearButton.size(smallButtonWidth, smallButtonHeight);

    clearButton.mousePressed(function() {
        soundFile1.stop();
        loopButton.remove();
        stopButton.remove();
        ampLFOButton.remove();
        delayButton.remove();
        delayLFOButton.remove();
        recorderButton1.size(recButtonWidth, recButtonHeight);
        recorderButton1.html('RECORD');
        state1 = 0;
        soundFile1 = new p5.SoundFile();
        clearButton.remove();
    });
}

function addAmpModButton() {
    ampLFOButton = createButton('AMPLITUDE MOD ON');
    ampLFOButton.position(ampLFOButtonX, ampLFOButtonY);
    ampLFOButton.size(w/11, h/24);
    ampLFOButton.mousePressed(ampLFOActivate);
}

function ampLFOActivate() {
    if (!ampLFOActive) {
        ampLFOButton.html('AMPLITUDE MOD OFF');
        ampLFO.start();
        ampLFO.disconnect();
        ampLFO.freq(ampModFreqSlider.value());
        ampLFO.amp(1.0);

        ampLFOActive = true;

        ampLFOAnalyzer.setInput(ampLFO);
    }
    else {
        ampLFOButton.html('AMPLITUDE MOD ON');
        ampLFO.stop();
        ampLFOActive = false;
    }
}

function addDelayButton() {
    delayButton = createButton('DELAY ON');   //  make button
    delayButton.position(delayButtonX, delayButtonY);
    delayButton.size(delayButtonWidth, delayButtonHeight);
    delayButton.mousePressed(activateDelay);    //  trigger delay effect

    delayTimeSlider = createSlider(0.1, 1, 0.5, 0.00001);   //  control delay time
    delayTimeSlider.position(2.9 * (w/6), 0.95 * (h/5));
    delayTimeSlider.size(w/10, h/50);

    delayFeedbackSlider = createSlider(0.01, 0.99, 0.5, 0.00001);   //  control delay feedback
    delayFeedbackSlider.position(2.9 * (w/6), 1.345 * (h/5));
    delayFeedbackSlider.size(w/10, h/50);

    delayLFOButton = createButton('DELAY LFO ON');   //  set delay time to LFO output
    delayLFOButton.position(2.9 * (w/6), 1.103 * (h/5));
    delayLFOButton.size(w/24.5, h/25);
    delayLFOButton.mousePressed(activateDelayLFO);
}

//  turn on delay effect
function activateDelay() {
    if (!delayActive) {   //    on
        delayActive = true;
        delayButton.html('DELAY OFF');
    }
    else {              //  off
        delayActive = false;
        delayButton.html('DELAY ON');
    }

    if (delayActive) {  //  set up delay
        delay.connect();
        delay.setType('pingPong');
        delay.process(soundFile1);
        delay.delayTime(0.5);
        delay.delayTime(delayTimeSlider.value());
        delay.feedback(delayFeedbackSlider.value());
        delay.filter(2000);
    }
    else {  //  turn off delay
        delay.disconnect();
        delayTimeSlider.remove();
    }
}

function activateDelayLFO() {
    if (!delayLFOActive) {
        delayLFO.start();
        delayLFO.disconnect();
        delayLFO.amp(delayLFODepthSlider.value());
        delayLFO.freq(delayLFOFreqSlider.value());

        delayLFOAnalyzer.setInput(delayLFO);
        
        delay.delayTime(delayLFO.scale(-1, 1, 0, 1));

        delayLFOButton.html('DELAY LFO OFF');    
        delayLFOActive = true;
    }
    else {
        delayLFO.stop();
        delayLFOButton.html('DELAY LFO ON');
        delayLFOActive = false;
    }
}

function addFilterButton() {
    filterButton = createButton('FILTER ON');
    filterButton.position(filterButtonX, filterButtonY);
    filterButton.size(delayButtonWidth, delayButtonHeight);
    filterButton.mousePressed(activateFilter);

    filterFreqSlider = createSlider(0, 5000, 500, 0.1);
    filterFreqSlider.position(2.55 * (w/4), 1.15 * filterButtonY);
    filterFreqSlider.size(w/10, h/50);

    filterResSlider = createSlider(0.01, 30, 5, 0.01);
    filterResSlider.position(2.55 * (w/4), 1.3 * filterButtonY);
    filterResSlider.size(w/10, h/50);

    filterLFOButton = createButton('FILTER LFO ON');
    filterLFOButton.position(0.92 * filterButtonX, filterButtonY);
    filterLFOButton.size(w/24.5, h/25);
    filterLFOButton.mousePressed(activateFilterLFO);
}

function activateFilter() {
    if (!filterActive) {    //  on
        filterActive = true;
        filterButton.html('FILTER OFF');
    }
    else {              //  off
        filterActive = false;
        filterButton.html('FILTER ON');
    }
    
    if (filterActive) {    //  set up filter
        filter.connect(soundFile1);
        filter.setType('lowpass')
        filter.process(soundFile1);
        filter.freq(filterFreqSlider.value());
        filter.res(filterResSlider.value());
        filter.drywet(1.0);
    }
    else {
        filter.setType('allpass');
        filter.drywet(0.0);
    }
}

function activateFilterLFO() {
    if (!filterLFOActive) {
        filterLFO.start()
        filterLFO.disconnect();
        filterLFO.amp(filterLFODepthSlider.value());
        filterLFO.freq(filterLFOFreqSlider.value());
        
        filterLFOAnalyzer.setInput(filterLFO);

        filterLFOButton.html('FILTER LFO OFF')
        filterLFOActive = true;
    }
    else {
        filterLFO.stop();
        filterLFOButton.html('FILTER LFO ON');
        filterLFOActive = false;
    }
}

function addreverbButton() {
    reverbButton = createButton('REVERB ON');
    reverbButton.position(reverbButtonX, reverbButtonY);
    reverbButton.size(delayButtonWidth, delayButtonHeight);
    reverbButton.mousePressed(activatereverb);

    reverbTimeSlider = createSlider(0.0, 1, 0.5, 0.001);
    reverbTimeSlider.position(reverbButtonX, 1.2 * reverbButtonY);
    reverbTimeSlider.size(w/10, h/50);

    reverseReverbButton = createButton('REVERSE VERB');
    reverseReverbButton.position(1.09 * reverbButtonX, reverbButtonY);
    reverseReverbButton.size(w/22, h/25);
    reverseReverbButton.mousePressed(function () {
        if (!reverbReverse) {
            reverb.set(4, 5, true);
            reverseReverbButton.html('REVERSE OFF');
        }
        else {
            reverb.set(4, 5, false);
            reverseReverbButton.html('REVERSE VERB');
        }
        
    })

}

function activatereverb() {
    if (!reverbActive) {
        reverbButton.html('REVERB OFF');
        reverbActive = true;
    }
    else {
        reverbButton.html('REVERB ON');
        reverbActive = false;
    }
    
    if (reverbActive) {
        reverb.process(soundFile1, 4, 5, false);
        reverb.amp(2);
        soundFile1.connect(reverb);
        
        reverb.drywet(reverbTimeSlider.value());
    }
    else {
        reverb.drywet(0);
    }

}

function createSliders() {
    ampModFreqSlider = createSlider(0.001, 15.0, 8.0, 0.001);
    ampModFreqSlider.position(w/34, (h/10));
    ampModFreqSlider.size(w/9, h/150);
    ampModFreqSlider.hide();
    
    ampModDepthSlider = createSlider(0.001, 1.0, 1.0, 0.001);
    ampModDepthSlider.position(w/34, h/7);
    ampModDepthSlider.size(w/9, h/150);
    ampModDepthSlider.hide();

    delayLFOFreqSlider = createSlider(0.0001, 2, 0.3, 0.0001);
    delayLFOFreqSlider.position(w/34, (h/10));
    delayLFOFreqSlider.size(w/9, h/150);
    delayLFOFreqSlider.hide();

    delayLFODepthSlider = createSlider(0.001, 1.0, 1.0, 0.001);
    delayLFODepthSlider.position(w/34, h/7);
    delayLFODepthSlider.size(w/9, h/150);
    delayLFODepthSlider.hide();

    filterLFOFreqSlider = createSlider(0.001, 20, 0.5, 0.001);
    filterLFOFreqSlider.position(w/34, (h/10));
    filterLFOFreqSlider.size(w/9, h/150);
    filterLFOFreqSlider.hide();

    filterLFODepthSlider = createSlider(0.001, 1.0, 1.0, 0.001);
    filterLFODepthSlider.position(w/34, h/7);
    filterLFODepthSlider.size(w/9, h/150);
    filterLFODepthSlider.hide();
}



window.onresize = function() {
    w = window.innerWidth;
    h = window.innerHeight;
}