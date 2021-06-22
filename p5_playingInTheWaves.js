let w = window.innerWidth;
let h = window.innerHeight;
let mic, recorder, soundFile1; 
let recorderButton1, recButtonWidth = w/12, recButtonHeight = h/12, recButtonX = 2.75 * (w/4), recButtonY = h/5;
let state1 = 0;
let playheadMonitor = 0, playheadActive = false;
let progBarWidth = w/6, progBarHeight = h/28, progBarX = 3.2 * (w/4), progBarY = 1.01 * h/5;
let loopingActive = false;
let loopButton, loopButtonX = 2.75 * (w/4), loopButtonY = 1.2 * (h/5), smallButtonWidth = w/12, smallButtonHeight = h/24;
let clearButton, stopButton, initialButtonSize = h/12;
let lfo1, lfo2, lfoButton1, lfoButton2, lfoFreqSlider, lfoAmpSlider, lfoActive1=false, lfoAnalyzer1, lfoWave, lfoOut;
let lfoVizRectWidth=w/18, lfoVizRectHeight=h/1.5, rect1X = (w/18), rect1Y = 0.9 * (h/4);


function preload()
{
    sound1 = loadSound("sounds/CD_boilingWater_hiss_01.wav");
    sound2 = loadSound("sounds/CD_paper_slide_lazer_03.wav");
}

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

    lfo1 = new p5.Oscillator('sine');
    lfoButton1 = createButton('ACTIVATE LFO 1');
    lfoButton1.position(w/20, h/12);
    lfoButton1.mousePressed(LFO1Activate);

    lfoFreqSlider = createSlider(0.001, 15.0, 8.0, 0.001);
    lfoFreqSlider.position(w/34, (h/8));
    lfoFreqSlider.size(w/9, h/150);
    
    lfoAmpSlider = createSlider(0.001, 1.0, 1.0, 0.001);
    lfoAmpSlider.position(w/34, h/6);
    lfoAmpSlider.size(w/9, h/150);

    lfoAnalyzer1 = new p5.FFT();    
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
    text("Playing In The Waves: A Play-Based Approach to Generative Sound Design", w/2, h / 20);

    //  labels
    textSize(16);
    text("LFO Frequency", w/12, 1.1 * (h/7));
    text("LFO Depth", w/12, 0.98 * (h/5));


    // bar fills as clip is played through
    if (playheadActive) {
        noFill();
        strokeWeight(2);
        rectMode(CORNER);
        rect(progBarX, progBarY, progBarWidth, progBarHeight);
        //  fill progress bar 
        fill(113, 218, 113);
        playheadMonitor = map(soundFile1.currentTime(), 0, soundFile1.duration(), 0, progBarWidth);
        rect(progBarX, progBarY, playheadMonitor, progBarHeight);
    }

    lfo1.freq(lfoFreqSlider.value());

    //  draw lfo visualizer
    rectMode(CORNER);
    fill(0);

    rect(rect1X, rect1Y, lfoVizRectWidth, lfoVizRectHeight);

    fill(113, 218, 113);

    if (lfoActive1) {
        let r = 50
        let min = (rect1Y + lfoVizRectHeight)-r;
        let max = rect1Y + r;

        lfoWave = lfoAnalyzer1.waveform();
        let lfoY = map(lfoWave[0], -1, 1, min, max);
        circle(rect1X + (lfoVizRectWidth/2), lfoY, r*2);
        lfoOut = map(lfoWave[0], -1, 1, 0, 1);
        soundFile1.setVolume(lfoOut, 0.01);
        lfo1.amp(lfoAmpSlider.value());
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
            testText = "clip length: " + soundFile1.duration(); 
            playheadActive = true;
            addLoopButton();
            addStopButton();
            addClearButton();
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
    stopButton.position(2.17 * (w/4), h/5);
    stopButton.size(150, smallButtonHeight);
    stopButton.mousePressed(function() {soundFile1.stop()});
}

function addClearButton() {
    clearButton = createButton('CLEAR SAMPLE');
    clearButton.position(2.17 * (w/4), 1.2 * (h/5));
    clearButton.size(smallButtonWidth, smallButtonHeight);

    clearButton.mousePressed(function() {
        soundFile1.stop();
        loopButton.remove();
        stopButton.remove();
        recorderButton1.size(smallButtonWidth, recButtonWidth);
        recorderButton1.html('RECORD');
        state1 = 0;
        soundFile1 = new p5.SoundFile();
        clearButton.remove();
    });
}

function LFO1Activate() {
    if (!lfoActive1) {
        lfoButton1.html('DEACTIVATE LFO 1');
        lfo1.start();
        lfo1.disconnect();
        lfo1.freq(lfoFreqSlider.value());
        lfo1.amp(1.0);
        lfoActive1 = true;

        lfoAnalyzer1.setInput(lfo1);
    }
    else {
        lfoButton1.html('ACTIVATE LFO 1');
        lfo1.stop();
        lfoActive1 = false;
    }
}

window.onresize = function() {
    w = window.innerWidth;
    h = window.innerHeight;
}