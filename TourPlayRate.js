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
let sample1Button, sample1Active=false, sample2Button, sample2Active=false, sample3Active=false;
let seekLoop;
let linkForward, linkBackward, titleLink;
let pageRecorder, pageRecButX = w * 0.9, pageRecButY = 0.85 * h, pageRecButWd=0.65 * recButWd;

//  load sound files and set up volume nodes
function preload() {
    volNode = new Tone.Volume().toDestination();    //  final volume output

    //  SAMPLE 1
    sample1Forward = new Tone.Player('./sounds/metal_water_bottle.wav');
    sample1Forward.loop = true;
    sample1Backward = new Tone.Player({
        url: './sounds/metal_water_bottle.wav',
        loop: true,
        reverse: true,
        volume: -100
    });
    
    //  SAMPLE 2
    sample2Forward = new Tone.Player('./sounds/slap2.wav');
    sample2Forward.loop = true;
    sample2Backward = new Tone.Player({
        url: './sounds/slap2.wav',
        loop: true,
        reverse: true,
        volume: -100
    });

    //  SAMPLE 3
    sample3Forward = new Tone.Player('./sounds/martina_3.wav');
    sample3Forward.loop = true;
    sample3Backward = new Tone.Player({
        url: './sounds/martina_3.wav',
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
    samplerSignal = new SignalCircle((recButX + (0.5 * recButWd)), (recButY - (0.3 * recButHt)), 0.4 * recButHt);

    mic.connect(samplerButton.recorder);      //  connect microphone output to Tone recorder object
    
    scope = new OscScope(soundVizX, soundVizY, soundVizWd, soundVizHt, 2048, 1024, true);
    volNode.connect(scope.wave);

    shifter = new Tone.PitchShift().connect(volNode);   //  pitch shifter, routed to volnode, which is routed out

    samplerButton.playerForward.connect(shifter);   //  connect all output to pitch shifter
    samplerButton.playerBackward.connect(shifter);
    sample1Forward.connect(shifter);
    sample1Backward.connect(shifter);
    sample2Forward.connect(shifter);
    sample2Backward.connect(shifter);
    sample3Forward.connect(shifter);
    sample3Backward.connect(shifter);

    sample1Button = createButton('SAMPLE 1');       //  SAMPLE 1 BUTTON
    sample1Button.position(recButX, 3 * recButY);
    sample1Button.size(recButWd, recButHt);
    sample1Button.mousePressed(triggerSample1); 
    sample1Signal = new SignalCircle((recButX + (0.5 * recButWd)), 2.8 * recButY, 0.4 * recButHt);

    sample2Button = createButton('SAMPLE 2');       //  SAMPLE 2 BUTTON
    sample2Button.position(recButX, 4.5 * recButY);
    sample2Button.size(recButWd, recButHt);
    sample2Button.mousePressed(triggerSample2); 
    sample2Signal = new SignalCircle((recButX + (0.5 * recButWd)), 4.3 * recButY, 0.4 * recButHt);

    sample3Button = createButton('SAMPLE 3');       //  SAMPLE 3 BUTTON
    sample3Button.position(recButX, 6 * recButY);
    sample3Button.size(recButWd, recButHt);
    sample3Button.mousePressed(triggerSample3); 
    sample3Signal = new SignalCircle((recButX + (0.5 * recButWd)), 5.8 * recButY, 0.4 * recButHt);

    // link to next stop
    linkForward = createA('https://cpmdude89.github.io/playingInTheWaves/TourAmpMod.html', 'NEXT TOUR STOP');
    linkForward.position(0.8 * w, 0.04 * h);
    linkForward.style('font-size', '1.5vw');

    //  link back to homepage
    linkBackward = createA('https://cpmdude89.github.io/playingInTheWaves/playingInTheWaves.html', 'BACK TO HOMEPAGE');
    linkBackward.position(0.05 * w, 0.04 * h);
    linkBackward.style('font-size', '1.5vw');

    //  set up title link -> explainer
    titleLink = createDiv('Tour: Play Back Rate and Pitch Shift');
    titleLink.position(0.26 * w, 0.03 * h);
    titleLink.class('popup');
    titleLink.style('font-size', '3vw');
    titleLink.style('font-family', 'sans-serif');
    titleLink.mouseOver(() => {
        titleLink.style('color', 'DarkOrchid');
        titleLink.style('font-weight', 'bold');
        titleLink.position(0.25 * w, 0.03 * h)
    })
    titleLink.mouseOut(() => {
        titleLink.style('color', 'Black');
        titleLink.style('font-weight', 'normal');
        titleLink.position(0.26 * w, 0.03 * h);
    })
    titleLink.mousePressed(() => {
        window.open('./explainers/explainer_playRate.html');
    })
    
    //  page recorder to record output
    pageRecorder = new PageRecorder(pageRecButX, pageRecButY, pageRecButWd, recButHt);
    volNode.connect(pageRecorder.recorder);
    pageRecorderSignal = new SignalCircle(pageRecButX + (0.5 * pageRecButWd), pageRecButY - (0.5 * recButHt), 0.4 * recButHt);

    Tone.Transport.start(); 
}

function draw() {
    textOutput();
    background(0, 150, 80);    
    textAlign(CENTER);

    //  signal circles
    if (samplerButton.state == 'recording') {     
        samplerSignal.drawRecordingCircle();
    }

    if (samplerButton.playerForward.state == 'started') {     
        samplerSignal.drawActiveCircle()
    }

    if (sample1Forward.state == 'started') {
        sample1Signal.drawActiveCircle();
    }

    if (sample2Forward.state == 'started') {
        sample2Signal.drawActiveCircle();
    }

    if (sample3Forward.state == 'started') {
        sample3Signal.drawActiveCircle();
    }

    if (pageRecorder.state == 'recording') {
        pageRecorderSignal.drawRecordingCircle();
    }
    
    scope.process();    //  draw oscilloscope

     //  mapping mouse 
    if (mouseX >= leftSide && mouseX <= rightSide && mouseY >= topSide && mouseY <= bottomSide) {      //  if mouse is within bounds to manipulate
        if (samplerButton.state == 'play' || samplerButton.state == 'stop' || sample1Active || sample2Active || sample3Active) {   //  if audio has been loaded
            let mapMouseX = map(mouseX, leftSide, rightSide, -1.51, 1.51);      //  map mouse x-axis to square bounds
            let mapMouseY = map(mouseY, topSide, bottomSide, -1.51, 1.51);      //  map mouse y-axis to square bounds

            textSize(30);   //  set up text to keep track of coordinates
            fill(0);
            noStroke();
            text('X-axis: ' + mapMouseX.toFixed(2), 1.2 * rightSide, 1.1 * topSide);    //  coordinate text
            text('Y-axis: ' + -mapMouseY.toFixed(2), 1.2 * rightSide, 1.4 * topSide);
            
            fill(255)   //  white
            circle(mouseX, mouseY, 0.05 * soundVizWd);  //  circle to help see where mouse is on sound viz

            if (mapMouseX < 0) {    //  switch to backwards if mouse is on negative side of x-axis
                samplerButton.playerForward.volume.rampTo(-100, 0.1);
                samplerButton.playerBackward.volume.rampTo(0, 0.1);
                sample1Forward.volume.rampTo(-100, 0.1);
                sample1Backward.volume.rampTo(0, 0.1);
                sample2Forward.volume.rampTo(-100, 0.1);
                sample2Backward.volume.rampTo(0, 0.1);
                sample3Forward.volume.rampTo(-100, 0.1);
                sample3Backward.volume.rampTo(0, 0.1);
            }
            else {  //  switch to forwards if mouse is on positive side of x-axis
                samplerButton.playerForward.volume.rampTo(0, 0.1);
                samplerButton.playerBackward.volume.rampTo(-100, 0.1);   
                sample1Forward.volume.rampTo(0, 0.1);
                sample1Backward.volume.rampTo(-100, 0.1);
                sample2Forward.volume.rampTo(0, 0.1);
                sample2Backward.volume.rampTo(-100, 0.1);
                sample3Forward.volume.rampTo(0, 0.1);
                sample3Backward.volume.rampTo(-100, 0.1);
            }

            samplerButton.playerForward.playbackRate = abs(mapMouseX);    //  adjust playback rate according to mouse position on sound viz
            samplerButton.playerBackward.playbackRate = abs(mapMouseX);
            sample1Forward.playbackRate = abs(mapMouseX);
            sample1Backward.playbackRate = abs(mapMouseX);
            sample2Forward.playbackRate = abs(mapMouseX);
            sample2Backward.playbackRate = abs(mapMouseX);
            sample3Forward.playbackRate = abs(mapMouseX);
            sample3Backward.playbackRate = abs(mapMouseX);

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
            sample3Forward.volume.rampTo(0, 0.1);
            sample3Backward.volume.rampTo(-100, 0.1);
        }
        
        else if (mouseX >= soundVizX) {     //  if mouse came out of square with forwards player up, just back sure backwards player is down
            samplerButton.playerBackward.volume.rampTo(-100, 0.1);
            sample1Backward.volume.rampTo(-100, 0.1);
            sample2Backward.volume.rampTo(-100, 0.1);
            sample3Backward.volume.rampTo(-100, 0.1);
        }
    
        samplerButton.playerForward.playbackRate = 1.0;     //  reset playback rate if mouse comes out of square bounds
        sample1Forward.playbackRate = 1.0;
        sample2Forward.playbackRate = 1.0;
        sample3Forward.playbackRate = 1.0;
    }

    //  draw coordinate lines
    stroke(255, 0, 0);    //  red
    strokeWeight(2)
    line(leftSide, soundVizY, rightSide, soundVizY);    //  x-axis
    line(soundVizX, topSide, soundVizX, bottomSide);    // y-axis
    noFill();
    square(soundVizX, soundVizY, 0.666 * soundVizWd);

    //  draw compass
    stroke(0);      
    strokeWeight(4);    
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

// -------- functions to handle sample playback -------- // 

function triggerSample1() {     //  SAMPLE 1
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

function triggerSample2() {     //  SAMPLE 2 
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

function triggerSample3() {     //  SAMPLE 3
    if (!sample3Active) {
        sample3Forward.start();
        sample3Backward.start();

        sample3Active = true;
    }

    else {
        sample3Forward.volume.rampTo(-100, 0.1);
        sample3Backward.volume.rampTo(-100, 0.1);
        sample3Forward.stop();
        sample3Backward.stop();

        sample3Active = false;
    }
}
