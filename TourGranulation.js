/**
 * Here is the granulation component of the 'tour'
 * 
 * User will record into an audio buffer like before
 * Then (hopefully) the entire audio file will be displayed for the user to scroll through
 * 
 */

 let w=window.innerWidth, h=window.innerHeight;
 let mic, recorder, recordButton, data, blob, player;
 let recButX=(0.425 * w), recButY=(0.14 * h), recButWd=(0.15 * w), recButHt=(0.1 * h);
 let clearBut;
 let state = 0;
 let bufferArray;
 let volNode;
 let soundVizX=0.5 * w, soundVizY=0.6 * h, soundVizWd=0.75 * w, soundVizHt=0.65 * h;
 let leftSide = soundVizX - (0.5 * soundVizWd);
 let rightSide = soundVizX + (0.5 * soundVizWd);
 let topSide = soundVizY - (0.5 * soundVizHt);
 let bottomSide = soundVizY + (0.5 * soundVizHt);
 let start, end, offset=0.2, startLine=0, endLine=0, lineOffset=0, offsetPercent=0, offsetPercentInPixels=0, maxOffset = 1.0;
 let playActive=false;
 let env;
 let linkBackward;
 let startPoint, loopLength, loop;
 let limiter;
 
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
     limiter = new Tone.Limiter(-2).connect(volNode);

    linkBackward = createA('https://cpmdude89.github.io/playingInTheWaves/TourDelay.html', 'PREVIOUS TOUR STOP');
    linkBackward.position(0.05 * w, 0.05 * h);

    loop = new Tone.Loop(playLoop, 0.3);

    Tone.Transport.start();
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
         circle((recButX + (1.25 * recButWd)), (recButY + (0.5 * recButHt)), 0.4 * recButHt);
     }
     
 
     if (state > 1) {
         fill(0);    //  black
         rectMode(CENTER);   //  align rectangle to center
         rect(soundVizX, soundVizY, soundVizWd, soundVizHt);  //  create backdrop for waveform drawing
         
 
         stroke(255);
         strokeWeight(1);
 
         beginShape();
         for (let i = 0; i < player.buffer.toArray(0).length; i += 300) {
 
             let x = map(i, 0, player.buffer.toArray(0).length, leftSide, rightSide);
             let y = map(player.buffer.toArray(0)[i], -1, 1, bottomSide, topSide);
 
             vertex(x, y);
         }
         endShape();
 
         stroke(255, 0, 0);
         line(startLine, topSide, startLine, bottomSide); //  start line
         line(endLine, topSide, endLine, bottomSide);   //  end line
 
         textSize(30);
         stroke(0);
         if (playActive) {
             text('Click anywhere on black box to STOP playback.', 0.5 * w, 0.85 * topSide);
         }
         else {
             text('Click anywhere on black box to START playback.', 0.5 * w, 0.85 * topSide);
         }
     }
 
     // if there is an audio buffer to mess with and mouse is inside visualizer
     if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide && state > 1) {    
         let mousePos = map(mouseX, leftSide, rightSide, 0, 1);  //  percentage x-axis in rectangle
 
         let bufferTimeInSeconds = player.buffer.length / player.buffer.sampleRate;   //  total length in seconds of audio file
 
         maxOffset = 0.5;
         if (maxOffset >= bufferTimeInSeconds) {
             maxOffset = bufferTimeInSeconds;
         }
         offset = map(mouseY, bottomSide, topSide, 0.01, maxOffset);     //  dynamically set offset to y-axis
         
         if (loopLength != offset) {
            loopLength = offset;
         }
         
         start = (mousePos * bufferTimeInSeconds);   //  percentage of x-axis in rect multiplied by total buffer length or percentage of buffer
         startPoint = (mousePos * bufferTimeInSeconds);
 
         end = start + offset;  //  loop length of 0.2 sec
 
         if (start > (bufferTimeInSeconds - offset)) {   //  range control
             start = bufferTimeInSeconds - offset;
         }
 
         if (end > bufferTimeInSeconds) {    //  range control
             end = bufferTimeInSeconds;
         }
 
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
 
 
 
 async function recordIn() {
     if (state == 0) {       //  begin recording
         setTimeout(function() {recorder.start()}, 120);     //  wait 120 ms to avoid mouse click then begin recording
 
         recordButton.html('STOP RECORDING');        //  change button text
         state = 1;      //  move record state through
     }
 
     else if (state == 1) {      //  stop recording
         data = await recorder.stop();   //  end recording and return a javascript promise with the result in it
         blob = URL.createObjectURL(data);   //  save the result of the recoder object into a blob and assign it a url object
         player = new Tone.Player(blob).connect(limiter);  //  connect recording to Tone player and route player to master output
         //player = new Tone.GrainPlayer(blob).connect(volNode);  //  connect recording to Tone player and route player to master output
         //player.overlap = 0.02;
         //player.grainSize = 0.05;
         //player.playbackRate = 0.95;
         player.fadeIn = 0.02;
         player.fadeOut = 0.02;

 
         showControls();
 
         recordButton.html('PLAY RECORDING');    //  change button text
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
 
 function mouseClicked() {
     if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide && state > 1) {
         if (!playActive) {

            loop.start();
             playActive = true;
         }
         else {
             loop.stop();
             player.stop();
             playActive = false;
         }
     }
 }

 function playLoop(time) {
    
    player.start(0, startPoint);
    //let stopTime = "+" + loopLength;
    //player.stop(stopTime);

    loop.interval = loopLength;
 }