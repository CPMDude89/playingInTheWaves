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
let soundVizX_fund=0.3 * w, soundVizY=0.7 * h, soundVizWd=0.3 * w, soundVizHt=0.5 * h;
let soundVizX_delay=0.67 * w;
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

    LFOWave = new Tone.Waveform();
    delayTimeLFO.connect(LFOWave);

    lfoFreqSlider = createSlider(0.01, 1, 0.05, 0.001);      //  delay time LFO freq slider
    lfoFreqSlider.size(sliderWd);
    lfoFreqSlider.position(0.2 * w, 0.4 * h);
    lfoFreqSlider.hide();

    fundWave = new Tone.Waveform();
    volNode.connect(fundWave);

    delayWave = new Tone.Waveform();
    delayVolNode.connect(delayWave);
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

    fill(0);        //  set up LFO visualizer
    rectMode(CORNER);
    rect(lfoVizRectX, lfoVizRectY, lfoVizRectWd, lfoVizRectHt);     //  LFO visualizer vertical bar
    if (delayTimeLFOActive) {     //  LFO visualizer
        delayTimeLFO.frequency.rampTo(lfoFreqSlider.value(), 0.05);
        
        fill(100, 50, 150); //  nice purple color
        stroke(0);
        strokeWeight(2);
        //  set output of delay time lfo to the y-axis of ball to visualize LFO
        let LFOBuffer = LFOWave.getValue();
        let y = LFOBuffer[0];
        circle((0.5 * lfoVizRectWd) + lfoVizRectX, map(y, 0, 1, (lfoVizRectY + lfoVizRectHt), lfoVizRectY), 1.75 * lfoVizRectWd);
        
        fill(0);
        noStroke();
        textSize(34);
        text('Delay time LFO is at rate: ' + lfoFreqSlider.value() + ' Hz', 0.5 * w, 0.34 * h);
        text('Delay time is: ' + y.toFixed(2) + ' seconds long', 0.5 * w, 0.38 * h);
        
    }

    fill(0);    //  black
    rectMode(CENTER);   //  align rectangle to center
    rect(soundVizX_fund, soundVizY, soundVizWd, soundVizHt);  //  create backdrop for waveform drawing
    rect(soundVizX_delay, soundVizY, soundVizWd, soundVizHt);    

    stroke(255);        //  set up wave visualizer
    strokeWeight(3);
    noFill();
    let buffer = fundWave.getValue();  //  assign variable for array to analyze

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
        let x = map(i, start, end, (soundVizX_fund - (0.5 * soundVizWd)), (soundVizX_fund + (0.5 * soundVizWd)));   
        let y = map(buffer[i], -1, 1, (soundVizY - (0.5 * soundVizHt)), (soundVizY + (0.5 * soundVizHt)));

        vertex(x,y);    //  assign to point in custom vertex shape
    }
    endShape();     //  finish custom vertex shape

    if (delayActive) {      //  add delay line visualizer -----------------------------------------------------------------------------------------------
        let buffer = delayWave.getValue();  //  assign variable for array to analyze

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
        let x = map(i, start, end, (soundVizX_delay - (0.5 * soundVizWd)), (soundVizX_delay + (0.5 * soundVizWd)));   
        let y = map(buffer[i], -1, 1, (soundVizY - (0.5 * soundVizHt)), (soundVizY + (0.5 * soundVizHt)));

        vertex(x,y);    //  assign to point in custom vertex shape
    }
    endShape();     //  finish custom vertex shape
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
        lfoFreqSlider.show();
        delayTimeLFOBut.html('DEACTIVATE DELAY TIME LFO');
        delayTimeLFOActive = true;
    }
    else {  //  if LFO is on, turn off
        delayTimeLFO.stop();
        lfoFreqSlider.hide();
        delayTimeLFOBut.html('ACTIVATE DELAY TIME LFO');
        delayTimeLFOActive = false;
    }
}