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
let mic, recorder, audioBuffer, recordButton, data, blob, player;
let recButX=(0.11 * w), recButY=(0.2 * h), recButWd=(0.1 * w), recButHt=(0.1 * h);
let clearBut;
let state = 0;
let lfoVizRectX=(0.85 * w), lfoVizRectY=(recButY), lfoVizRectWd=(0.03 * w), lfoVizRectHt=(0.6 * h);
let lfoFreqSlider, sliderWd=(0.6 * w);
let soundVizX=0.5 * w, soundVizY=0.7 * h, soundVizWd=0.45 * w, soundVizHt=0.5 * h;
let volNode, delayVolNode;
let delay, delayBut, delayActive=false, delayTimeLFO, delayTimeLFOBut, delayTimeLFOActive=false;
let fundWave, delayWave;


function setup() {
    createCanvas(w, h);

    volNode = new Tone.Volume().toDestination();
    delayVolNode = new Tone.Volume({
        volume: -100
    }).toDestination();

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    recorder = new Tone.Recorder();     //  set up Tone recorder
    mic.connect(recorder);      //  connect microphone output to Tone recorder object

    recordButton = createButton('RECORD');      //  record button
    recordButton.position(recButX, recButY);
    recordButton.size(recButWd, recButHt);
    recordButton.mousePressed(recordIn);    

    delayBut = createButton('ACTIVATE DELAY');
    delayBut.position((2 * recButWd) + recButX, recButY);
    delayBut.size(recButWd, recButHt);
    delayBut.mousePressed(triggerDelay);

    delayTimeLFOBut = createButton('ACTIVATE DELAY TIME LFO');
    delayTimeLFOBut.position((3.5 * recButWd) + recButX, recButY);
    delayTimeLFOBut.size(recButWd, recButHt);
    delayTimeLFOBut.mousePressed(triggerDelayTimeLFO);

    delay = new Tone.FeedbackDelay({
        feedback: 0.5,
        wet: 1
    }).connect(delayVolNode);

    delayTimeLFO = new Tone.LFO({
        amplitude: 1,
        frequency: 0.05,
        min: 0.001,
        max: 0.95
    }).connect(delay.delayTime);
}

function draw() {
    background(0, 150, 80);
    
    noStroke();
    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nDelay', 0.5 * w, 0.05 * h); //  page title

    if (state == 1) {     //  if button is recording
        fill(255, 0, 0);    //  red for record light
        circle((recButX + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }
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
        player.connect(delay);      //  connect Tone player to delay node

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
    clearBut = createButton('START\nOVER');
    clearBut.position(recButX - (0.7 * recButWd), recButY);
    clearBut.size(0.5 * recButWd, recButHt);
    clearBut.mousePressed(function() {
        recordButton.html('RECORD');
        player.stop();
        state = 0;
        clearBut.remove();
    });
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
        delayTimeLFOBut.html('DEACTIVATE DELAY TIME LFO');
        delayTimeLFOActive = true;
    }
    else {  //  if LFO is on, turn off
        delayTimeLFO.stop();
        delayTimeLFOBut.html('ACTIVATE DELAY TIME LFO');
        delayTimeLFOActive = false;
    }
}