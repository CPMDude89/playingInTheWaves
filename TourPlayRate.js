let w = window.innerWidth;
let h = window.innerHeight;
let mic, recorder, audioBuffer, recordButton, data, blob, playerForward, playerBackward, playActive = false;
let recButX=(0.07 * w), recButY=(0.12 * h), recButWd=(0.1 * w), recButHt=(0.1 * h);
let clearBut;
let state = 0;
let soundVizX=0.5 * w, soundVizY=0.55 * h, soundVizWd=0.45 * w, soundVizHt=0.5 * h;
let leftSide = soundVizX - (0.5 * soundVizWd);
let rightSide = soundVizX + (0.5 * soundVizWd);
let topSide = soundVizY - (0.5 * soundVizWd);
let bottomSide = soundVizY + (0.5 * soundVizWd);
let volNode, volNodeWave;
let shifter;


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

    volNodeWave = new Tone.Waveform();
    volNodeWave.size = 2048;
    volNode.connect(volNodeWave);

    shifter = new Tone.PitchShift().connect(volNode);

    playerForward = new Tone.Player().connect(shifter);
    playerBackward = new Tone.Player({}).connect(shifter);

    playerBackward.reverse = true;
    playerBackward.volume.value = -100;
}

function draw() {
    background(0, 150, 80);     // nice shade of forest green

    noStroke();
    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nPlayback Rate and Pitch Shift', 0.5 * w, 0.05 * h); //  page title

    if (state == 1) {     //  if button is recording
        fill(255, 0, 0);    //  red for record light
        circle((recButX + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }

    fill(0);    //  black
    rectMode(CENTER);   //  align rectangle to center
    square(soundVizX, soundVizY, soundVizWd);  //  create backdrop for waveform drawing

    if (state > 1) {
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

     //  mapping mouse 
     if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide && state > 1) {
        let mapMouseX = map(mouseX, leftSide, rightSide, -1.51, 1.51);
        let mapMouseY = map(mouseY, topSide, bottomSide, -1.51, 1.51);

        textSize(30);
        fill(0);
        noStroke();
        text('X-axis: ' + mapMouseX.toFixed(2), 1.2 * rightSide, 1.1 * topSide);
        text('Y-axis: ' + mapMouseY.toFixed(2), 1.2 * rightSide, 1.4 * topSide);
        
        fill(255)   //  white
        circle(mouseX, mouseY, 0.05 * soundVizWd);  //  circle to help see where mouse is on sound viz

        if (mapMouseX < 0) {    //  switch to backwards if mouse is on negative side of x-axis
            playerForward.volume.rampTo(-100, 0.01);
            playerBackward.volume.rampTo(0, 0.01);
        }
        else {  //  switch to forwards if mouse is on positive side of x-axis
            playerForward.volume.rampTo(0, 0.01);
            playerBackward.volume.rampTo(-100, 0.01);   
        }

        playerForward.playbackRate = abs(mapMouseX);    //  adjust playback rate according to mouse position on sound viz
        playerBackward.playbackRate = abs(mapMouseX);

        shifter.pitch = map(mapMouseY, -1.51, 1.51, 18, -18);
    }
    else {
        shifter.pitch = 0;

        if (mouseX < soundVizX) {
            playerForward.volume.rampTo(0, 0.1);
            playerBackward.volume.rampTo(-100, 0.1);
        }
        
        else if (mouseX >= soundVizX) {
            playerBackward.volume.rampTo(-100, 0.1);
        }
    
        playerForward.playbackRate = 1.0;
    }

    //  draw coordinate lines
    stroke(255, 0, 0);    //  red
    strokeWeight(2)
    line(leftSide, soundVizY, rightSide, soundVizY);    //  x-axis
    line(soundVizX, topSide, soundVizX, bottomSide);    // y-axis
    noFill();
    square(soundVizX, soundVizY, 0.666 * soundVizWd);
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
        playerForward.load(blob); //  connect recording to Tone player and route player to master output
        playerBackward.load(blob);

        showControls(); //  create 'start over' button

        recordButton.html('PLAY RECORDING');    //  change button text
        state = 2;
    }

    else if (state == 2) {      //  play recording
        playerForward.loop = true; //  set player to loop output
        playerBackward.loop = true;
        playerForward.start();   //  play back recording
        playerBackward.start();

        recordButton.html('STOP PLAYBACK');     //  change button text
        state = 3;  //  more record state
    }

    else if (state == 3) {      //  stop playback
        playerForward.stop();    //    stop playing
        playerBackward.stop();

        recordButton.html('PLAY RECORDING');
        state = 2;
    }
}

function showControls() {
    clearBut = createButton('START\nOVER');
    clearBut.position(0.15 * recButX, recButY);
    clearBut.size(0.5 * recButWd, recButHt);
    clearBut.mousePressed(function() {
        recordButton.html('RECORD');
        playerForward.stop();
        playerBackward.stop();

        playerForward.volume.rampTo(0, 0.1);
        playerForward.playbackRate = 1;

        playerBackward.volume.rampTo(-100, 0.1);

        state = 0;
        clearBut.remove();
    });
}

