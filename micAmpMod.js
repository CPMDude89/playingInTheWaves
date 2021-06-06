let mic, recorder, soundFile;
let state = 0;
let playButton;
let loopButton;
let stopButton;
let ampModButton;
let ampModSlider;
let ampModToggle = false;
let phase = 0;
let ampMod = 0;
let osc;
let oscAmpModButton;
let oscAmpModToggle = false;
let oscAmpModSlider;

function setup() {
    let canv = createCanvas(500, 500);
    canv.mousePressed(canvasPressed);
    background(110);
    textAlign(CENTER, CENTER);

    //  initialize audio input
    mic = new p5.AudioIn();

    //  tells browser to allow mic input
    mic.start();

    //  initialize a way to record audio
    recorder = new p5.SoundRecorder();

    //  connect mic and recorder object
    recorder.setInput(mic);

    //  this sound file will be used to
    //  playback and save the recording
    soundFile = new p5.SoundFile();

    text('click to record', width/2, height/2);

    osc = new p5.Oscillator;
}

function canvasPressed() {
    //  make sure audio is good to go
    userStartAudio();

    //  make sure user has mic enabled
    if (state === 0 && mic.enabled) {

        //  record into p5.SoundFile
        recorder.record(soundFile, 10, makeInterface);

        background(255, 0, 0);
        text('Recording Audio!', width/2, height/2);
        state++;
    }
    else if(state === 1) {
        background(0, 255, 0);

        //  stop recorder and 
        //  send result to soundFile
        recorder.stop();

        text('Done! Tap to play and download', width/2, height/2, width - 20);
        state++;
    }

    else if (state === 2) {
        soundFile.play();
    }
}

function makeInterface() {
    playButton = createButton('PLAY');
    playButton.mousePressed(playSoundFile);

    loopButton = createButton('LOOP');
    loopButton.mousePressed(loopSoundFile);

    stopButton = createButton('STOP');
    stopButton.mousePressed(stopSoundFile);

    ampModButton = createButton('AMP MOD VIA DRAW');
    ampModButton.mousePressed(activateAmpMod);

    ampModSlider = createSlider(0.1, 10, 4.0, 0.1);

    oscAmpModButton = createButton('AMP MOD VIA OSC');
    oscAmpModButton.mousePressed(activateOscAmpMod);

    oscAmpModSlider = createSlider(0.001, 30, 10, 0.1);
}

function playSoundFile() {
    soundFile.play();
}

function loopSoundFile() {
    soundFile.loop();
}

function stopSoundFile() {
    soundFile.stop();
}

function activateAmpMod() {
    if (!ampModToggle) {
        ampModToggle = true;
    }
    else {
        ampModToggle = false;
    }
}

function activateOscAmpMod() {
    if (!oscAmpModToggle) {
        oscAmpModToggle = true;
        osc.start()
        osc.disconnect();
        osc.connect(soundFile);
        osc.amp(1.0);
        osc.freq(oscAmpModSlider.value());
    }
    else {
        oscAmpModToggle = false;
        osc.stop();
    }
}

function draw() {

    if (ampModToggle) {
        ampMod = map(sin(phase), -1, 1, 0.001, 0.9);

        phase += ampModSlider.value();

        soundFile.setVolume(ampMod, 0.01);
    }
    //console.log(ampMod);

    if (oscAmpModToggle) {
        osc.freq(oscAmpModSlider.value());

        soundFile.setVolume(osc);
    }
}