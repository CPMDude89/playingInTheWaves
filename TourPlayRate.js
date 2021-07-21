let w = window.innerWidth;
let h = window.innerHeight;
let mic, recorder, audioBuffer, recordButton, data, blob, player;
let recButX=(0.11 * w), recButY=(0.2 * h), recButWd=(0.1 * w), recButHt=(0.1 * h);
let clearBut;
let state = 0;
let soundVizX=0.5 * w, soundVizY=0.7 * h, soundVizWd=0.45 * w, soundVizHt=0.5 * h;
let testToneButton, testTone, testToneActive=false;
let volNode, volNodeWave;
let shifter;


function setup() {
    createCanvas(w, h);     //  make p5 canvas

    volNode = new Tone.Volume().toDestination();

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    recorder = new Tone.Recorder();     //  set up Tone recorder
    mic.connect(recorder);      //  connect microphone output to Tone recorder object

    player = new Tone.Player().connect(volNode);

    recordButton = createButton('RECORD');      //  record button
    recordButton.position(recButX, recButY);
    recordButton.size(recButWd, recButHt);
    recordButton.mousePressed(recordIn);    

    testToneButton = createButton('TEST TONE');     //  sine wave test tone 
    testToneButton.position(recButX, (0.5 * soundVizHt) + soundVizY - (recButHt));    //  sine wave helps the visualizer see the side bands
    testToneButton.size(recButWd, recButHt);
    testToneButton.mousePressed(triggerTestTone);

    volNodeWave = new Tone.Waveform();
    volNodeWave.size = 2048;
    volNode.connect(volNodeWave);

    testTone = new Tone.Oscillator(200, 'sine');

    shifter = new Tone.FrequencyShifter().connect(volNode);
}

function draw() {
    background(0, 150, 80);     // nice shade of forest green

    noStroke();
    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nAmplitude Modulation', 0.5 * w, 0.05 * h); //  page title

    if (state == 1) {     //  if button is recording
        fill(255, 0, 0);    //  red for record light
        circle((recButX + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }

    fill(0);    //  black
    rectMode(CENTER);   //  align rectangle to center
    rect(soundVizX, soundVizY, soundVizWd, soundVizHt);  //  create backdrop for waveform drawing

    stroke(255);        //  set up wave visualizer
    strokeWeight(3);
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
        player.load(blob) //  connect recording to Tone player and route player to master output

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