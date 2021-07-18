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
let mic, recorder, audioBuffer, recordButton, data, blob, player;
let recButX=(0.11 * w), recButY=(0.2 * h), recButWd=(0.1 * w), recButHt=(0.1 * h);
let state = 0;
let lfoVizRectX=(0.85 * w), lfoVizRectY=(recButY), lfoVizRectWd=(0.03 * w), lfoVizRectHt=(0.6 * h);
let lfoFreqSlider, sliderWd=(0.6 * w);
let soundVizX=0.5 * w, soundVizY=0.7 * h, soundVizWd=0.45 * w, soundVizHt=0.5 * h;
let testToneButton, testTone, testToneActive=false;
let ampModButton, ampModLFO, ampModActive = false;
let volNode;
let volNodeWave, LFOWave;

function setup() {
    createCanvas(w, h);     //  make p5 canvas

    volNode = new Tone.Volume().toDestination();

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    recorder = new Tone.Recorder();     //  set up Tone recorder
    mic.connect(recorder);      //  connect microphone output to Tone recorder object

    recordButton = createButton('RECORD');      //  record button
    recordButton.position(recButX, recButY);
    recordButton.size(recButWd, recButHt);
    recordButton.mousePressed(recordIn);    

    testTone = new Tone.Oscillator(200, 'sine').connect(volNode);

    testToneButton = createButton('TEST TONE');     //  sine wave test tone 
    testToneButton.position(recButX, (0.5 * soundVizHt) + soundVizY - (recButHt));    //  sine wave helps the visualizer see the side bands
    testToneButton.size(recButWd, recButHt);
    testToneButton.mousePressed(triggerTestTone);

    ampModLFO = new Tone.LFO(1, -100, 0);
    ampModLFO.phase = 90;
    ampModLFO.connect(volNode.volume);

    ampModButton = createButton('ACTIVATE\nAMP MOD');
    ampModButton.position((2 * recButWd) + recButX, recButY);
    ampModButton.size(recButWd, recButHt);
    ampModButton.mousePressed(triggerAmpMod);

    volNodeWave = new Tone.Waveform();
    volNodeWave.size = 2048;
    volNode.connect(volNodeWave);

    LFOWave = new Tone.Waveform();
    ampModLFO.connect(LFOWave);

    lfoFreqSlider = createSlider(0.1, 50, 2, 0.1);      //  amp mod freq slider
    lfoFreqSlider.size(sliderWd);
    lfoFreqSlider.position(0.2 * w, 0.4 * h);
    lfoFreqSlider.hide();
    
}

function draw() {
    background(0, 150, 80);     // nice shade of forest green

    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nAmplitude Modulation: Tone.js Version', 0.5 * w, 0.05 * h); //  page title

    if (state == 1) {     //  if button is recording
        fill(255, 0, 0);    //  red for record light
        circle((recButX + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }

    fill(0);        //  set up LFO visualizer
    rectMode(CORNER);
    rect(lfoVizRectX, lfoVizRectY, lfoVizRectWd, lfoVizRectHt);     //  LFO visualizer vertical bar

    if (ampModActive) {     //  LFO visualizer
        ampModLFO.frequency.rampTo(lfoFreqSlider.value(), 0.05);
        
        fill(100, 50, 150); //  nice purple color
        //  set output of amp mod lfo to the y-axis of ball to visualize amp mod
        //circle((0.5 * lfoVizRectWd) + lfoVizRectX, map(gain, 0, 1, (lfoVizRectY + lfoVizRectHt), lfoVizRectY), 1.75 * lfoVizRectWd);
        let AMBuffer = LFOWave.getValue();
        let y = AMBuffer[0];
        circle((0.5 * lfoVizRectWd) + lfoVizRectX, map(y, 0, 1, (lfoVizRectY + lfoVizRectHt), lfoVizRectY), 1.75 * lfoVizRectWd);
        
        fill(0);
        textSize(40);
        text('Amplitude modulation is at rate: ' + lfoFreqSlider.value() + ' Hz', 0.5 * w, 0.38 * h);
        
    }

    fill(0);    //  black
    rectMode(CENTER);   //  align rectangle to center
    rect(soundVizX, soundVizY, soundVizWd, soundVizHt);  //  create backdrop for waveform drawing

    stroke(255);        //  set up wave visualizer
    strokeWeight(2);
    noFill();
    let buffer = volNodeWave.getValue();  //  assign variable for array to analyze

    let start = 0;      //  find the starting point to stabalize wave
    for (let i = 1; i < buffer.length; i++) {
        if (buffer[i-1] < 0 && buffer[i] >= 0) {    //  find the point in the wave that equals 0
            start = i;                              //  by finding the two places in the buffer that go from negative to positive 
            break;      //  break out of loop
        }
    }
    let end = start + (0.5 * buffer.length);    //  set end point, and always fixed amount

    beginShape()    //  begin custom vertex shape
    for (let i = start; i < end; i++) {   //  iterate over returned array    
        let x = map(i, start, end, (soundVizX - (0.5 * soundVizWd)), (soundVizX + (0.5 * soundVizWd)));   
        let y = map(buffer[i], -1, 1, (soundVizY - (0.5 * soundVizHt)), (soundVizY + (0.5 * soundVizHt)));

        vertex(x,y);    //  assign to point in custom vertex shape
    }
    endShape();     //  finish custom vertex shape
}


async function recordIn() {
    if (state == 0) {       //  begin recording
        setTimeout(function() {recorder.start()}, 120);     //  wait 120 ms to avoid mouse click then begin recording

        recordButton.html('STOP RECORDING');        //  change button text
        state = 1;      //  move record state through
    }

    else if (state == 1) {      //  stop recording
        data = await recorder.stop();   //  end recording and return a javascript promise with the result in it
        blob = URL.createObjectURL(data);   //  save the result of the recoder object into a blob and assign it a url object
        audioBuffer = new Tone.ToneAudioBuffer(blob);    //  create a new audio buffer and assign it to the url object. Finally the recording is in an audio buffer
        player = new Tone.Player(audioBuffer).connect(volNode);  //  connect recording to Tone player and route player to master output

        showControls();

        recordButton.html('PLAY RECORDING');    //  change button text
        state = 2;
    }

    else if (state == 2) {      //  play recording
        player.loop = true; //  set player to loop output
        player.start();   //  play back recording

        recordButton.html('STOP PLAYBACK');     //  change button text
        state = 3;  //  more record state
    }

    else if (state == 3) {      //  stop playback
        player.stop();    //    stop playing

        recordButton.html('PLAY RECORDING');
        state = 2;
    }
}

function showControls() {

    
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