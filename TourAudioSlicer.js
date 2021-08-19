/**
 * Here is the granulation component of the 'tour'
 * 
 * User will record into an audio buffer like before
 * Then (hopefully) the entire audio file will be displayed for the user to scroll through
 * 
 */

let w=window.innerWidth, h=window.innerHeight;
let mic, recorder, recordButton, data, blob, player, player2;
let recButX=(0.08 * w), recButY=(0.14 * h), recButWd=(0.1 * w), recButHt=(0.1 * h);
let samp1ButX=(0.9 * w), sampButWd=(0.07 * w), sampButHt=(0.08 * h);
let samp1ButY=(0.15 * h), samp2ButY=(0.3 * h), samp3ButY=(0.45 * h), samp4ButY=(0.6 * h);
let clearBut;
let state = 0;
let bufferArray;
let volNode;
let soundVizX=0.5 * w, soundVizY=0.6 * h, soundVizWd=0.75 * w, soundVizHt=0.65 * h;
let leftSide = soundVizX - (0.5 * soundVizWd);
let rightSide = soundVizX + (0.5 * soundVizWd);
let topSide = soundVizY - (0.5 * soundVizHt);
let bottomSide = soundVizY + (0.5 * soundVizHt);
let start, end, offset=0.2, startLine=0, endLine=0, lineOffset=0, offsetPercent=0, offsetPercentInPixels=0, maxOffset, minOffset=0.01;
let playActive=false;
let env;
let linkForward, linkBackward;
let loopStartPoint, loopLength, clip;
let limiter;
let newBuffer, newFileButton;
let sample1Active=false, sample2Active=false, sample3Active=false, sample4Active=false;
let pageRecorder, pageRecButX = w * 0.9, pageRecButY = 0.85 * h, pageRecButWd=0.65 * recButWd;

function preload() {
    //  volume nodes
    volNode = new Tone.Volume().toDestination();
    limiter = new Tone.Limiter(-2).connect(volNode);

    //  stock samples
    sample1 = new Tone.ToneAudioBuffer("./sounds/metal_water_bottle.wav");
    sample2 = new Tone.ToneAudioBuffer("./sounds/CD_jump.wav");
    sample3 = new Tone.ToneAudioBuffer("./sounds/slap2.wav");
    sample4 = new Tone.ToneAudioBuffer("./sounds/bassOrbit2.wav");
}

function setup() {
    canv = createCanvas(w, h);

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    recorder = new Tone.Recorder();     //  set up Tone recorder
    mic.connect(recorder);      //  connect microphone output to Tone recorder object

    recordButton = createButton('RECORD');      //  record button
    recordButton.position(recButX, recButY);
    recordButton.size(recButWd, recButHt);
    recordButton.mousePressed(recordIn);    

    //  stock sample buttons
    sample1Button = createButton('SAMPLE 1');
    sample1Button.position(samp1ButX, samp1ButY);
    sample1Button.size(sampButWd, sampButHt);
    sample1Button.mousePressed(triggerSample1);

    sample2Button = createButton('SAMPLE 2');
    sample2Button.position(samp1ButX, samp2ButY);
    sample2Button.size(sampButWd, sampButHt);
    sample2Button.mousePressed(triggerSample2);

    sample3Button = createButton('SAMPLE 3');
    sample3Button.position(samp1ButX, samp3ButY);
    sample3Button.size(sampButWd, sampButHt);
    sample3Button.mousePressed(triggerSample3);

    sample4Button = createButton('SAMPLE 4');
    sample4Button.position(samp1ButX, samp4ButY);
    sample4Button.size(sampButWd, sampButHt);
    sample4Button.mousePressed(triggerSample4);

    //  navigational links
    linkForward = createA('https://cpmdude89.github.io/playingInTheWaves/PITW_Playground.html', 'ON TO THE PLAYGROUND!');
    linkForward.position(0.75 * w, 0.04 * h);
    linkForward.style('font-size', '1.5vw');

    linkBackward = createA('https://cpmdude89.github.io/playingInTheWaves/TourDelay.html', 'PREVIOUS TOUR STOP');
    linkBackward.position(0.05 * w, 0.04 * h);
    linkBackward.style('font-size', '1.5vw');

    //  this is the loop to time granulation
    clip = new Tone.Loop(playclip, 0.3);    

    //  page recorder to grab page's audio out
    pageRecorder = new PageRecorder(pageRecButX, pageRecButY, pageRecButWd, recButHt);
    volNode.connect(pageRecorder.recorder);
    pageRecorderSignal = new SignalCircle(pageRecButX + (0.5 * pageRecButWd), pageRecButY - (0.5 * recButHt), 0.4 * recButHt);

    Tone.Transport.start();     //  start Tone.js timing architecture
}

function draw() {
    textOutput();
    background(0, 150, 80);

    noStroke();
    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nAudio Slicing', 0.5 * w, 0.05 * h); //  page title

    //  signal circles
    if (state == 1) {     //    signal circle for main 'samplerButton'
        fill(255, 0, 0);    
        circle((recButX + (1.25 * recButWd)), (recButY + (0.5 * recButHt)), 0.4 * recButHt);
    }

    if (pageRecorder.state == 'recording') {
        pageRecorderSignal.drawRecordingCircle();
    }
    

    if (state > 1) {
        fill(0);    //  black
        rectMode(CENTER);   //  align rectangle to center
        rect(soundVizX, soundVizY, soundVizWd, soundVizHt);  //  create backdrop for waveform drawing
        
        stroke(255);
        strokeWeight(1);

        //  draw waveform
        beginShape();
        for (let i = 0; i < player.buffer.toArray(0).length; i += 300) {

            let x = map(i, 0, player.buffer.toArray(0).length, leftSide, rightSide);    //  get x coordinate
            let y = map(player.buffer.toArray(0)[i], -1, 1, bottomSide, topSide);       //  get y coordinate

            vertex(x, y);   //  draw point at coordinate
        }
        endShape(); //  end drawing waveform

        textSize(30);
        noStroke();
        //  trigger textual guides when audio is stored in buffer
        if (playActive || sample1Active || sample2Active || sample3Active || sample4Active) {
            text('Click anywhere on black box to STOP playback.', 0.5 * w, 0.85 * topSide);
            strokeWeight(5);
            stroke(0);
            line(0.06 * w, topSide + (0.1 * soundVizHt), 0.06 * w, bottomSide - (0.1 * soundVizHt));
            textSize(20)
            noStroke();
            text('LARGER SLICE', 0.06 * w, topSide + (0.08 * soundVizHt));
            text('SMALLER SLICE', 0.06 * w, bottomSide - (0.05 * soundVizHt));
        }
        else {
            text('Click anywhere on black box to START playback.', 0.5 * w, 0.85 * topSide);
        }
    }

    // if there is an audio buffer to mess with and mouse is inside visualizer
    if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide && state > 1 && playActive) {    
        let mousePos = map(mouseX, leftSide, rightSide, 0, 1);  //  percentage x-axis in rectangle

        let bufferTimeInSeconds = player.buffer.length / player.buffer.sampleRate;   //  total length in seconds of audio file

        maxOffset = 0.3 * bufferTimeInSeconds;  //  dynamically sets maximum loop length to 1/3 of total clip length

        //  offset is loop length, and dynamically set loop length to mouse's Y-axis position inside the visualizer
        offset = map(mouseY, bottomSide, topSide, minOffset, maxOffset); 
        
        //  this sends down to the grain loop, to dynamically re-size loop length depending on y-axis position. Only if a change has been made
        if (loopLength != offset) {
        loopLength = offset;
        }
        
        start = (mousePos * bufferTimeInSeconds);   //  percentage of x-axis in rect multiplied by total buffer length or percentage of buffer
        loopStartPoint = (mousePos * bufferTimeInSeconds);

        if (start > (bufferTimeInSeconds - offset)) {   //  range control
            start = bufferTimeInSeconds - offset;
        }

        offsetPercent = offset / bufferTimeInSeconds;   //  percent of buffer time (in seconds) the offset is
        offsetPercentInPixels = soundVizWd * offsetPercent;     //  percent of visualization window

        startLine = mouseX;     //  assign graphics lines to mouse coordinates
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

    //  draw control lines
    stroke(255, 0, 0);
    strokeWeight(1.5);
        line(startLine, topSide, startLine, bottomSide); //  start line
        line(endLine, topSide, endLine, bottomSide);   //  end line
}


//  basically a SamplerButton, but with some modifications
async function recordIn() {
    if (state == 0 || state == 3) {       //  begin recording
        if (clip.state == 'started') {
            clip.stop();
            player.stop();
        }

        setTimeout(function() {recorder.start()}, 120);     //  wait 120 ms to avoid mouse click then begin recording

        recordButton.html('STOP RECORDING');        //  change button text
        state = 1;      //  move record state through
    }

    else if (state == 1) {      //  stop recording
        data = await recorder.stop();   //  end recording and return a javascript promise with the result in it
        blob = URL.createObjectURL(data);   //  save the result of the recoder object into a blob and assign it a url object
        player = new Tone.Player(blob).connect(limiter);  //  connect recording to Tone player and route player to master output
        player.fadeIn = 0.02;   //  actually using player fades here
        player.fadeOut = 0.02;
        
        showControls();     //  create start over button

        recordButton.html('PLAY RECORDING');    //  change button text
        state = 2;

        //  if a stock sample is active, turn them all off just in case
        sample1Active = false;
        sample2Active = false;
        sample3Active = false;
        sample4Active = false;
    }
}

//  make start over button and hide record button
function showControls() {
    recordButton.hide();

    clearBut = createButton('START\nOVER');
    clearBut.position(recButX - (recButWd * 0.6), recButY);
    clearBut.size(0.5 * recButWd, recButHt);
    clearBut.mousePressed(function() {
        recordButton.show();
        
        recordButton.html('RECORD');
        clip.stop();
        player.stop();
        state = 0;
        clearBut.remove();
    });
}

//  trigger audio process with mouse click
function mouseClicked() {
    if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide && state > 1) {
        if (!playActive) {
            clip.start();
            playActive = true;
        }

        else {
            clip.stop();
            player.stop();
            playActive = false;
        }
    }
}

//  here is the loop that adjusts the Tone.js Player object's start() method. Somehow, the playLoop's interval being adjusted kicks
//  in the player object's fadeOut. No idea how this works. This solution was a total accident. Adding stop() to the playLoop
//  or having the start() function get a duration parameter resulted in no fade out about 50% of the time
function playclip(time) {       
        player.start(0, loopStartPoint);

        clip.interval = loopLength;
}


//  stock sample functions
function triggerSample1() {
    state = 3;
    player = new Tone.Player(sample1).connect(limiter);  
    player.fadeIn = 0.02;
    player.fadeOut = 0.02;
    sample1Active = true;
    sample2Active = false;
    sample3Active = false;
    sample4Active = false;
}

function triggerSample2() {
    state = 3;
    player = new Tone.Player(sample2).connect(limiter);  
    player.fadeIn = 0.02;
    player.fadeOut = 0.02;
    sample1Active = false;
    sample2Active = true;
    sample3Active = false;
    sample4Active = false;
}

function triggerSample3() {
    state = 3;
    player = new Tone.Player(sample3).connect(limiter);  
    player.fadeIn = 0.02;
    player.fadeOut = 0.02;
    sample1Active = false;
    sample2Active = false;
    sample3Active = true;
    sample4Active = false;
}

function triggerSample4() {
    state = 3;
    player = new Tone.Player(sample4).connect(limiter);  
    player.fadeIn = 0.02;
    player.fadeOut = 0.02;
    sample1Active = false;
    sample2Active = false;
    sample3Active = false;
    sample4Active = true;
}