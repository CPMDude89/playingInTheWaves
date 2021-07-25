let w = window.innerWidth;
let h = window.innerHeight;
let mic, recorder, audioBuffer, recordButton, data, blob, playerForward, playerBackward, playActive = false;
let recButX=(0.07 * w), recButY=(0.12 * h), recButWd=(0.1 * w), recButHt=(0.1 * h);
let clearBut;
let state = 0;
let soundVizX=0.5 * w, soundVizY=0.55 * h, soundVizWd=0.45 * w, soundVizHt=0.45 * h;
let leftSide = soundVizX - (0.5 * soundVizWd);
let rightSide = soundVizX + (0.5 * soundVizWd);
let topSide = soundVizY - (0.5 * soundVizWd);
let bottomSide = soundVizY + (0.5 * soundVizWd);
let volNode, volNodeWave;
let shifter;
let sample1Button, sample1Active=false, sample2Button, sample2Active=false;
let seekLoop;

function preload() {
    limiter = new Tone.Limiter(-1).toDestination();
    volNode = new Tone.Volume().toDestination();
    sample1Forward = new Tone.Player('./sounds/metal_water_bottle.wav');
    sample1Forward.loop = true;

    sample1Backward = new Tone.Player({
        url: './sounds/metal_water_bottle.wav',
        loop: true,
        reverse: true,
        volume: -100
    });
    
    sample2Forward = new Tone.Player('./sounds/slinky_lazer.wav');
    sample2Forward.loop = true;

    sample2Backward = new Tone.Player({
        url: './sounds/slinky_lazer.wav',
        loop: true,
        reverse: true,
        volume: -100
    });
    
}

function setup() {
    createCanvas(w, h);     //  make p5 canvas

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    samplerButton = new ForwardsAndBackwardsSamplerButton(recButX, recButY, recButWd, recButHt);    //  initialize sampler button for recording and playback, forwards and backwards

    mic.connect(samplerButton.recorder);      //  connect microphone output to Tone recorder object
    
    scope = new OscScope(soundVizX, soundVizY, soundVizWd, soundVizHt, 2048, true);
    volNode.connect(scope.wave);

    shifter = new Tone.PitchShift().connect(volNode);

    samplerButton.playerForward.connect(shifter);
    samplerButton.playerBackward.connect(shifter);
    sample1Forward.connect(shifter);
    sample1Backward.connect(shifter);
    sample2Forward.connect(shifter);
    sample2Backward.connect(shifter);

    sample1Button = createButton('SAMPLE 1');
    sample1Button.position(recButX, 3 * recButY);
    sample1Button.size(recButWd, recButHt);
    sample1Button.mousePressed(triggerSample1); 

    sample2Button = createButton('SAMPLE 2');
    sample2Button.position(recButX, 5 * recButY);
    sample2Button.size(recButWd, recButHt);
    sample2Button.mousePressed(triggerSample2); 

    Tone.Transport.start();
}

function draw() {
    background(0, 150, 80);     // nice shade of forest green

    noStroke();
    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nPlayback Rate and Pitch Shift', 0.5 * w, 0.05 * h); //  page title

    if (samplerButton.state == 'recording') {     //  if button is recording
        fill(255, 0, 0);    //  red for record light
        circle((recButX + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }

    if (samplerButton.playerForward.state == 'started') {     //  if recorded audio is playing, draw blue circle
        fill(0, 0, 255);    //  blue
        circle((recButX + (0.5 * recButWd)), (recButY - (0.4 * recButHt)), 0.4 * recButHt);
    }

    if (sample1Forward.state == 'started') {
        fill(0, 0, 255);    //  blue
        circle((recButX + (0.5 * recButWd)), 2.7 * recButY, 0.4 * recButHt);
    }

    if (sample2Forward.state == 'started') {
        fill(0, 0, 255);    //  blue
        circle((recButX + (0.5 * recButWd)), 4.7 * recButY, 0.4 * recButHt);
    }
    
    scope.process();    //  draw oscilloscope

     //  mapping mouse 
    if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide) {      //  if mouse is within bounds to manipulate
        if (samplerButton.state == 'play' || samplerButton.state == 'stop' || sample1Active || sample2Active) {   //  if audio has been loaded
            let mapMouseX = map(mouseX, leftSide, rightSide, -1.51, 1.51);      //  map mouse x-axis to square bounds
            let mapMouseY = map(mouseY, topSide, bottomSide, -1.51, 1.51);      //  map mouse y-axis to square bounds

            textSize(30);   //  set up text to keep track of coordinates
            fill(0);
            noStroke();
            text('X-axis: ' + mapMouseX.toFixed(2), 1.2 * rightSide, 1.1 * topSide);    //  coordinate text
            text('Y-axis: ' + mapMouseY.toFixed(2), 1.2 * rightSide, 1.4 * topSide);
            
            fill(255)   //  white
            circle(mouseX, mouseY, 0.05 * soundVizWd);  //  circle to help see where mouse is on sound viz

            if (mapMouseX < 0) {    //  switch to backwards if mouse is on negative side of x-axis
                samplerButton.playerForward.volume.rampTo(-100, 0.1);
                samplerButton.playerBackward.volume.rampTo(0, 0.1);
                sample1Forward.volume.rampTo(-100, 0.1);
                sample1Backward.volume.rampTo(0, 0.1);
                sample2Forward.volume.rampTo(-100, 0.1);
                sample2Backward.volume.rampTo(0, 0.1);
            }
            else {  //  switch to forwards if mouse is on positive side of x-axis
                samplerButton.playerForward.volume.rampTo(0, 0.1);
                samplerButton.playerBackward.volume.rampTo(-100, 0.1);   
                sample1Forward.volume.rampTo(0, 0.1);
                sample1Backward.volume.rampTo(-100, 0.1);
                sample2Forward.volume.rampTo(0, 0.1);
                sample2Backward.volume.rampTo(-100, 0.1);
            }

            samplerButton.playerForward.playbackRate = abs(mapMouseX);    //  adjust playback rate according to mouse position on sound viz
            samplerButton.playerBackward.playbackRate = abs(mapMouseX);
            sample1Forward.playbackRate = abs(mapMouseX);
            sample1Backward.playbackRate = abs(mapMouseX);
            sample2Forward.playbackRate = abs(mapMouseX);
            sample2Backward.playbackRate = abs(mapMouseX);

            shifter.pitch = map(mapMouseY, -1.51, 1.51, 18, -18);   //  adjust pitch shifter to mapped mouse y-axis
        }
    }

    else {  
        shifter.pitch = 0;  //  reset pitch shifter if mouse is not inside square bounds

        if (mouseX < soundVizX) {   //  if mouse came out of square with backwards player up, down that down and turn up forwards player
            samplerButton.playerForward.volume.rampTo(0, 0.1);
            samplerButton.playerBackward.volume.rampTo(-100, 0.1);
            sample1Forward.volume.rampTo(0, 0.1);
            sample1Backward.volume.rampTo(-100, 0.1);
            sample2Forward.volume.rampTo(0, 0.1);
            sample2Backward.volume.rampTo(-100, 0.1);
        }
        
        else if (mouseX >= soundVizX) {     //  if mouse came out of square with forwards player up, just back sure backwards player is down
            samplerButton.playerBackward.volume.rampTo(-100, 0.1);
            sample1Backward.volume.rampTo(-100, 0.1);
            sample2Backward.volume.rampTo(-100, 0.1);
        }
    
        samplerButton.playerForward.playbackRate = 1.0;     //  reset playback rate if mouse comes out of square bounds
        sample1Forward.playbackRate = 1.0;
        sample2Forward.playbackRate = 1.0;
    }

    //  draw coordinate lines
    stroke(255, 0, 0);    //  red
    strokeWeight(2)
    line(leftSide, soundVizY, rightSide, soundVizY);    //  x-axis
    line(soundVizX, topSide, soundVizX, bottomSide);    // y-axis
    noFill();
    square(soundVizX, soundVizY, 0.666 * soundVizWd);

    //  draw compass
    stroke(0);      //  black
    strokeWeight(4);    //  thicker lines
    line(1.2 * rightSide, soundVizY - (0.3 * soundVizHt), 1.2 * rightSide, soundVizY + (0.3 * soundVizHt));
    line(1.1 * rightSide, soundVizY, 1.3 * rightSide, soundVizY);
    textSize(20);
    noStroke();
    fill(0);
    text('PITCH UP', 1.2 * rightSide, soundVizY - (0.35 * soundVizHt));
    text('PITCH DOWN', 1.2 * rightSide, soundVizY + (0.37 * soundVizHt));
    text('FORWARDS', 1.3 * rightSide, 0.97 * soundVizY);
    text('BACKWARDS', 1.1 * rightSide, 0.97 * soundVizY);
}

function triggerSample1() {
    if (!sample1Active) {
        sample1Forward.start();
        sample1Backward.start();

        sample1Active = true;
    }

    else {
        sample1Forward.volume.rampTo(-100, 0.1);
        sample1Backward.volume.rampTo(-100, 0.1);
        sample1Forward.stop();
        sample1Backward.stop();

        sample1Active = false;
    }
}

function triggerSample2() {
    if (!sample2Active) {
        sample2Forward.start();
        sample2Backward.start();

        sample2Active = true;
    }

    else {
        sample2Forward.volume.rampTo(-100, 0.1);
        sample2Backward.volume.rampTo(-100, 0.1);
        sample2Forward.stop();
        sample2Backward.stop();

        sample2Active = false;
    }
}
