let mic, recorder, soundFile1, soundFile2, recorderButton1, recorderButton2;
let state1 = 0;
let w = window.innerWidth;
let h = window.innerHeight;
let playheadMonitor = 0;
let playheadActive = false;
let rectWidth = 300;    //  for playhead progress bar
let rectHeight = 40;    //  for playhead progress bar
let loopingActive = false;
let loopButton, initialButtonSize = 80, loopButtonSize = initialButtonSize/2;
let clearButton, stopButton;
let lfo1, lfo2, lfoButton1, lfoButton2, lfoSlider1, lfoSlider2, lfoActive1=false;
let lfoVizRectWidth=100, lfoVizRectHeight=h/1.5;
let phase1=-1, phaseDelta1=0, freq1=0, sampleRate=60;

function preload()
{
    sound1 = loadSound("sounds/CD_boilingWater_hiss_01.wav");
    sound2 = loadSound("sounds/CD_paper_slide_lazer_03.wav");
}

function setup()
{
    createCanvas(w, h);
    
    mic = new p5.AudioIn(); //  get the soundRecorder input source ready
    mic.start();

    recorder = new p5.SoundRecorder();  //  connect input source to sound recorder
    recorder.setInput(mic);

    soundFile1 = new p5.SoundFile();    //  create audio object to store recorded audio
    
    recorderButton1 = createButton('RECORD');   //  record button
    recorderButton1.position(2.5 * (w/4), h/5);
    recorderButton1.size(150, initialButtonSize);
    recorderButton1.mousePressed(record1);

    lfo1 = new p5.Oscillator();
    lfoButton1 = createButton('ACTIVATE LFO 1');
    lfoButton1.position(w/10, h/6);
    lfoButton1.mousePressed(LFO1Activate);
    lfoSlider1 = createSlider(0.001, 15.0, 8.0, 0.001);
    lfoSlider1.size(200, 20);
    lfoSlider1.position(w/13, 1.2 * (h/6));
}

function draw()
{
    background(179, 179, 204);

    //  title
    fill(0);
    textSize(35);
    textAlign(CENTER)
    text("Playing In The Waves: A Play-Based Approach to Generative Sound Design", w/2, h / 10);

    // bar fills as clip is played through
    if (playheadActive) {
        noFill();
        strokeWeight(2);
        rectMode(CORNER);
        rect(2.9 * (w/4), h/5, rectWidth, rectHeight);
        //  fill progress bar 
        fill(113, 218, 113);
        playheadMonitor = map(soundFile1.currentTime(), 0, soundFile1.duration(), 0, rectWidth);
        rect(2.9 * (w/4), h/5, playheadMonitor, rectHeight);
    }

    lfo1.freq(lfoSlider1.value());

    //  draw lfo visualizer
    rectMode(CENTER);
    fill(0);
    rect1X = 1.1 * (w/8);
    rect1Y = 1.2 * (h/2);
    rect(rect1X, rect1Y, lfoVizRectWidth, lfoVizRectHeight);

    fill(113, 218, 113);
    min1 = rect1Y + (lfoVizRectHeight / 2);
    max1 = rect1Y - (lfoVizRectHeight / 2);
    //console.log(min1)

    
    let y1 = map(sin(phase1), -1, 1, min1, max1);
    circle(rect1X, y1, lfoVizRectWidth);
    //console.log(y1)

    if (lfoActive1) {
    phaseDelta1 = TWO_PI * lfoSlider1.value() / sampleRate;
    phase1 += phaseDelta1;
    }

    //console.log(mouseY);
}


// -------- CUSTOM FUNCTIONS -------- //
function record1()
{
    //  make sure audio is good to go
    userStartAudio();

    //  make sure user has mic enabled
    if (state1 === 0 && mic.enabled) {

        //  record into p5.SoundFile after 80 milliseconds to get past mouse click
        setTimeout(function() {recorder.record(soundFile1, 10)}, 80);

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
    loopButton.position(2.5 * (w/4), 1.2 * (h/5));
    loopButton.size(150, loopButtonSize);

    recorderButton1.size(150, loopButtonSize);

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
    stopButton.size(150, loopButtonSize);
    stopButton.mousePressed(function() {soundFile1.stop()});
}

function addClearButton() {
    clearButton = createButton('CLEAR SAMPLE');
    clearButton.position(2.17 * (w/4), 1.2 * (h/5));
    clearButton.size(150, loopButtonSize);

    clearButton.mousePressed(function() {
        soundFile1.stop();
        loopButton.remove();
        stopButton.remove();
        recorderButton1.size(150, initialButtonSize);
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
        lfo1.amp(1.0);
        lfo1.freq(lfoSlider1.value());
        soundFile1.setVolume(lfo1);
        lfoActive1 = true;
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