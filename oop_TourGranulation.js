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
 let sampButX=(0.9 * w), sampButY=(0.1 * h), sampButWd=(0.05 * w), sampButHt=(0.08 * h);
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
 let playActive=false, slicerFreeze=false;
 let env;
 let linkBackward;
 let loopStartPoint, loopLength, clip, changeSlice1=true, changeSlice2=false, slicer2Button, slicer, slicer2;
 let limiter;
 let newBuffer, newFileButton;
 
 function preload() {
     volNode = new Tone.Volume().toDestination();
     limiter = new Tone.Limiter(-2).connect(volNode);
     sample1 = new Tone.ToneAudioBuffer("./sounds/groove_clip.wav");
     sample2 = new Tone.ToneAudioBuffer("./sounds/metal_water_bottle.wav");
 }
 
function setup() {
    canv = createCanvas(w, h);

    frameRate(30);

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    recorder = new Tone.Recorder();     //  set up Tone recorder
    mic.connect(recorder);      //  connect microphone output to Tone recorder object

    recordButton = createButton('RECORD');      //  record button
    recordButton.position(recButX, recButY);
    recordButton.size(recButWd, recButHt);
    recordButton.mousePressed(recordIn);    
    

    slicer = new GranulationSlicer(leftSide, rightSide, topSide, bottomSide, soundVizWd, 255, 153, 0);
    slicer.player.connect(limiter);

    slicer2 = new GranulationSlicer(leftSide, rightSide, topSide, bottomSide, soundVizWd, 204, 0, 204);
    slicer2.player.connect(limiter);

    slicer2Button = createButton('SLICE 2');
    slicer2Button.position(0.04 * w, soundVizY);
    slicer2Button.size(sampButWd, sampButHt);
    slicer2Button.mousePressed(triggerSlicer2);

    sample1Button = createButton('SAMPLE 1');
    sample1Button.position(sampButX, sampButY);
    sample1Button.size(sampButWd, sampButHt);
    sample1Button.mousePressed(triggerSample1);

    sample2Button = createButton('SAMPLE 2');
    sample2Button.position(sampButX, 2.5 * sampButY);
    sample2Button.size(sampButWd, sampButHt);
    sample2Button.mousePressed(triggerSample2);

    linkBackward = createA('https://cpmdude89.github.io/playingInTheWaves/TourDelay.html', 'PREVIOUS TOUR STOP');
    linkBackward.position(0.05 * w, 0.05 * h);

    //clip = new Tone.Loop(playclip, 0.3);    //  this is the loop to time granulation

    Tone.Transport.start();     //  start Tone.js timing architecture
}
 
 function draw() {
     background(0, 150, 80);
 
     noStroke();
     textAlign(CENTER);  //  set up page title
     textSize(40);
     fill(0);       
     text('Playing In The Waves:\nGranulation: Multiple Class Instances', 0.5 * w, 0.05 * h); //  page title
 
     if (state == 1) {     //  if button is recording
         fill(255, 0, 0);    //  red for record light
         circle((recButX + (1.25 * recButWd)), (recButY + (0.5 * recButHt)), 0.4 * recButHt);
     }
 
     if (slicer.slice.state == 'started') {
         fill(0);
         textSize(20);
         noStroke();
         text('LOOP 1', 0.06 * w, soundVizY - (0.4 * soundVizHt));
 
         fill(255, 153, 0);
         circle(0.06 * w, soundVizY - (0.48 * soundVizHt), 0.4 * recButHt);
     }
     
 
    if (state > 1) {
        fill(0);    //  black
        rectMode(CENTER);   //  align rectangle to center
        rect(soundVizX, soundVizY, soundVizWd, soundVizHt);  //  create backdrop for waveform drawing
        
        stroke(255);
        strokeWeight(1);

        beginShape();
        for (let i = 0; i < slicer.player.buffer.toArray(0).length; i += 300) {

            let x = map(i, 0, slicer.player.buffer.toArray(0).length, leftSide, rightSide);
            let y = map(slicer.player.buffer.toArray(0)[i], -1, 1, bottomSide, topSide);

            vertex(x, y);
        }
        endShape();  
 
        textSize(30);
        stroke(0);
        if (playActive && slicerFreeze) {
            text('Click anywhere on black box to STOP playback.', 0.5 * w, 0.85 * topSide);
        }
        else if (playActive && !slicerFreeze) {
            text('Click anywhere on black box to FREEZE Slicer 1 playback.\nTrigger Slice 2 if You Want', 0.5 * w, 0.83 * topSide);
        }
        else if (!playActive && !slicerFreeze) {
            text('Click anywhere on black box to START playback.', 0.5 * w, 0.85 * topSide);
        }
     }
 
     // if there is an audio buffer to mess with and mouse is inside visualizer
    if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide && state > 1 && playActive) {    
        if (!slicerFreeze) {
            slicer2.process();     
            slicer2.drawLines();
            //console.log("slicer 1: " + slicer.player.state);
            //console.log("slicer 1 slice loop interval: " + slicer.slice.interval);
        }

        else if (slicerFreeze && changeSlice2) {
            slicer.process();
            slicer.drawLines();
            //console.log("slicer 2: " + slicer2.player.state);
            console.log("slicer 2 slice loop interval: " + slicer.slice.interval);
        }
    }

    if (slicerFreeze) {
        slicer.drawLines();
    }
 }
 
 async function recordIn() {
     if (state == 0 || state == 3) {       //  begin recording
         if (slicer.slice.state == 'started') {
             slicer.slice.stop();
             slicer.player.stop();
         }
 
         setTimeout(function() {recorder.start()}, 120);     //  wait 120 ms to avoid mouse click then begin recording
 
         recordButton.html('STOP RECORDING');        //  change button text
         state = 1;      //  move record state through
     }
 
     else if (state == 1) {      //  stop recording
         data = await recorder.stop();   //  end recording and return a javascript promise with the result in it
         blob = URL.createObjectURL(data);   //  save the result of the recoder object into a blob and assign it a url object
         //player = new Tone.Player(blob).connect(limiter);  //  connect recording to Tone player and route player to master output
         slicer.player.load(blob), () => {console.log('SLICER 1 LOADED')};
         slicer2.player.load(blob, () => {console.log('SLICER 2 LOADED')});
         slicer.player.fadeIn = 0.02;
         slicer.player.fadeOut = 0.02;
         slicer2.player.fadeIn = 0.02;
         slicer2.player.fadeOut = 0.02;
         
         showControls();
 
         recordButton.html('PLAY RECORDING');    //  change button text
         state = 2;
     }
 }
 
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
 
function mouseClicked() {
    if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide && state > 1) {
        if (!playActive && !slicerFreeze) {
            slicer.slice.start();
            //slicer.player.start();
            playActive = true;
        }

        else if (playActive && !slicerFreeze) {
            slicerFreeze = true;
        }

        else if (playActive && slicerFreeze) {
            slicer.slice.stop();
            slicer.player.stop();
            playActive = false;
            slicerFreeze = false;
        }
    }
}

function triggerSlicer2() {
    if (!changeSlice2) {
        changeSlice1 = false;
        changeSlice2 = true;

        slicer2.slice.start();

    }
}


 
function triggerSample1() {
    state = 3;
    player = new Tone.Player(sample1).connect(limiter);  //  connect recording to Tone player and route player to master output
    player.fadeIn = 0.02;
    player.fadeOut = 0.02;
}

function triggerSample2() {
    state = 3;
    player = new Tone.Player(sample2).connect(limiter);  //  connect recording to Tone player and route player to master output
    player.fadeIn = 0.02;
    player.fadeOut = 0.02;
}