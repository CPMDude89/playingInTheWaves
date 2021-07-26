/**
 * Here is the granulation component of the 'tour'
 * 
 * User will record into an audio buffer like before
 * Then (hopefully) the entire audio file will be displayed for the user to scroll through
 * 
 */

let w=window.innerWidth, h=window.innerHeight;
let mic;
let recButX=(0.425 * w), recButY=(0.14 * h), recButWd=(0.15 * w), recButHt=(0.1 * h);
let volNode;
let soundVizX=0.5 * w, soundVizY=0.6 * h, soundVizWd=0.75 * w, soundVizHt=0.65 * h;
let leftSide = soundVizX - (0.5 * soundVizWd);
let rightSide = soundVizX + (0.5 * soundVizWd);
let topSide = soundVizY - (0.5 * soundVizHt);
let bottomSide = soundVizY + (0.5 * soundVizHt);
let start, end, offset=0.2, startLine=0, endLine=0, lineOffset=0, offsetPercent=0, offsetPercentInPixels=0, maxOffset = 1.0;

function preload() {
    limiter = new Tone.Limiter(0).toDestination();
    volNode = new Tone.Volume().connect(limiter);
}

function setup() {
    canv = createCanvas(w, h);

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    samplerButton = new GranulationSamplerButton(recButX, recButY, recButWd, recButHt);
    mic.connect(samplerButton.recorder);      //  connect microphone output to Tone recorder object    
    samplerButton.player.connect(volNode);

    Tone.Transport.start();     //  need this line to make Sampler Button class work
}

function draw() {
    background(0, 150, 80);

    noStroke();
    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nGranulation', 0.5 * w, 0.05 * h); //  page title

    if (samplerButton.state == 'recording') {     //  if button is recording
        fill(255, 0, 0);    //  red for record light
        circle((recButX + (1.25 * recButWd)), (recButY + (0.5 * recButHt)), 0.4 * recButHt);
    }

    if (samplerButton.state == 'play' || samplerButton.state == 'stop') {
        //  failsafe
        if (samplerButton.playLength == 0) {
            samplerButton.playLength = samplerButton.player.buffer.length / samplerButton.player.buffer.sampleRate;
        }
        
        fill(0);    //  black
        rectMode(CENTER);   //  align rectangle to center
        rect(soundVizX, soundVizY, soundVizWd, soundVizHt);  //  create backdrop for waveform drawing
        

        stroke(255);
        strokeWeight(1);

        beginShape();
        for (let i = 0; i < samplerButton.player.buffer.toArray(0).length; i += 300) {

            let x = map(i, 0, samplerButton.player.buffer.toArray(0).length, leftSide, rightSide);
            let y = map(samplerButton.player.buffer.toArray(0)[i], -1, 1, bottomSide, topSide);

            vertex(x, y);
        }
        endShape();

        stroke(255, 0, 0);
        line(startLine, topSide, startLine, bottomSide); //  start line
        line(endLine, topSide, endLine, bottomSide);   //  end line

        textSize(30);
        stroke(0);

        if (samplerButton.player.state == 'started') {
            text('Click anywhere on black box to STOP playback.', 0.5 * w, 0.85 * topSide);
        }
        else {
            text('Click anywhere on black box to START playback.', 0.5 * w, 0.85 * topSide);
        }
    }


    // if there is an audio buffer to mess with and mouse is inside visualizer
    if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide) { 
        if (samplerButton.player.state == 'started') {    
            let mousePos = map(mouseX, leftSide, rightSide, 0, 1);  //  percentage x-axis in rectangle

            //  total length in seconds of audio file
            let bufferTimeInSeconds = samplerButton.player.buffer.length / samplerButton.player.buffer.sampleRate;   

            maxOffset = 0.4;
            if (maxOffset >= bufferTimeInSeconds) {
                maxOffset = bufferTimeInSeconds;
            }
            offset = map(mouseY, topSide, bottomSide, 0.03, maxOffset);     //  dynamically set offset to y-axis

            start = (mousePos * bufferTimeInSeconds);   //  percentage of x-axis in rect multiplied by total buffer length or percentage of buffer

            end = start + offset;  //  loop length of 0.2 sec

            if (start > (bufferTimeInSeconds - offset)) {   //  range control
                start = bufferTimeInSeconds - offset;
            }

            if (end > bufferTimeInSeconds) {    //  range control
                end = bufferTimeInSeconds;
            }

            samplerButton.setStartPoint(start);
            samplerButton.setLoopLength(offset);
            
            //samplerButton.player.setLoopPoints(start, end);   //  set loop to start point + offset

            offsetPercent = offset / bufferTimeInSeconds;   //  percent of buffer time (in seconds) the offset is
            offsetPercentInPixels = soundVizWd * offsetPercent;     //  percent of visualization window

            startLine = mouseX;
            endLine = mouseX + (soundVizWd * offsetPercent);

            if (endLine > rightSide) {  //  range control
                endLine = rightSide;
            }
            if (startLine < leftSide) { //  range control
                startLine = leftSide;
            }
            if (startLine > (rightSide - offsetPercentInPixels)) {  //  range control
                startLine = rightSide - offsetPercentInPixels;
            }   
        }
    }
}

function mouseClicked() {
    if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide) {
        if (samplerButton.state == 'play' || samplerButton.state == 'stop') {
            if (samplerButton.loop.state == 'stopped') {
                samplerButton.loop.start();
            }
            else {
                samplerButton.loop.stop();
            }
        }
    }
}

















/*
async function recordIn() {
    if (state == 0) {       //  begin recording
        setTimeout(function() {recorder.start()}, 120);     //  wait 120 ms to avoid mouse click then begin recording

        recordButton.html('STOP RECORDING');        //  change button text
        state = 1;      //  move record state through
    }

    else if (state == 1) {      //  stop recording
        data = await recorder.stop();   //  end recording and return a javascript promise with the result in it
        blob = URL.createObjectURL(data);   //  save the result of the recoder object into a blob and assign it a url object
        audioBuffer = new Tone.ToneAudioBuffer({    //  create a new audio buffer and assign it to the url object. Finally the recording is in an audio buffer
            url: blob,
        });    
        
        player = new Tone.Player(audioBuffer).connect(volNode);  //  connect recording to Tone player and route player to master output
        player.loop = true;
        player.fadeIn = 0.1;
        player.fadeOut = 0.5;

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
    recordButton.hide();

    clearBut = createButton('START\nOVER');
    clearBut.position(soundVizX - (soundVizWd * 0.5 ), 0.06 * h);
    clearBut.size(0.5 * recButWd, 0.5 * recButHt);
    clearBut.mousePressed(function() {
        recordButton.show();
        
        recordButton.html('RECORD');
        player.stop();
        state = 0;
        clearBut.remove();
    });
}
*/
/*
function mousePressed() {
    if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide && state > 1) {
        player.loop = true;
        player.start();
    }
}

function mouseReleased() {
    if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide && state > 1) {
        player.stop();
    }
}
*/

//function mouseDragged() {
