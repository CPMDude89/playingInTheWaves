/**
 * Here is the granulation component of the 'tour'
 * 
 * User will record into an audio buffer like before
 * Then (hopefully) the entire audio file will be displayed for the user to scroll through
 * 
 */

let w=window.innerWidth, h=window.innerHeight;
let mic, recorder, audioBuffer, recordButton, data, blob, player;
let recButX=(0.11 * w), recButY=(0.2 * h), recButWd=(0.1 * w), recButHt=(0.1 * h);
let clearBut;
let state = 0;
let bufferArray;
let volNode;
let soundVizX=0.5 * w, soundVizY=0.65 * h, soundVizWd=0.75 * w, soundVizHt=0.55 * h;
let leftSide = soundVizX - (0.5 * soundVizWd);
let rightSide = soundVizX + (0.5 * soundVizWd);
let topSide = soundVizY - (0.5 * soundVizHt);
let bottomSide = soundVizY + (0.5 * soundVizHt);
let start, end, startLine=0, endLine=0, lineOffset=0, offsetPercent=0;

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

    volNode = new Tone.Volume().toDestination();

    audioBuffer = new Tone.ToneAudioBuffer();
}

function draw() {
    background(0, 150, 80);

    noStroke();
    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nGranulation', 0.5 * w, 0.05 * h); //  page title

    if (state == 1) {     //  if button is recording
        fill(255, 0, 0);    //  red for record light
        circle((recButX + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }
    
    fill(0);    //  black
    rectMode(CENTER);   //  align rectangle to center
    rect(soundVizX, soundVizY, soundVizWd, soundVizHt);  //  create backdrop for waveform drawing

    if (state > 1) {
        stroke(255);
        strokeWeight(1);

        beginShape();
        for (let i = 0; i < audioBuffer.toArray(0).length; i += 300) {

            let x = map(i, 0, audioBuffer.toArray(0).length, leftSide, rightSide);
            let y = map(audioBuffer.toArray(0)[i], -1, 1, bottomSide, topSide);

            vertex(x, y);
        }
        endShape();

        stroke(0, 200, 255);
        line(mouseX, 0, mouseX, h); //  start line
        line(endLine, 0, endLine, h);   //  end line
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
        audioBuffer = new Tone.ToneAudioBuffer({    //  create a new audio buffer and assign it to the url object. Finally the recording is in an audio buffer
            url: blob,
        });    
        
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

function mouseDragged() {
    // if there is an audio buffer to mess with and mouse is inside visualizer
    if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide && state > 1) {    
        let mousePos = map(mouseX, leftSide, rightSide, 0, 1);  //  percentage x-axis in rectangle

        let bufferTimeInSeconds = player.buffer.length / player.buffer.sampleRate;   //  total length in seconds of audio file

        start = (mousePos * bufferTimeInSeconds);   //  percentage of x-axis in rect multiplied by total buffer length or percentage of buffer

        end = start + 0.2;  //  loop length of 0.2 sec
        
        offsetPercent = 0.2 / bufferTimeInSeconds;

        endLine = mouseX + (soundVizWd * offsetPercent);

        player.setLoopPoints(start, end);
        
        console.log('start line is: ' + start);
        console.log('Total file length: '+ bufferTimeInSeconds);
        //console.log(mousePos);
        //console.log('mouseX is: ' + mouseX + ' and mousePos is: ' + mousePos);
        //console.log(endLine);
    }
}