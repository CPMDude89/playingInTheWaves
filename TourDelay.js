/**
 * Here is the Delay component of the 'tour'
 * User can record into a buffer or pick from an available sound, which will then go into a delay line
 * The delay time will be connected to an LFO as well
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
let soundVizX=0.5 * w, soundVizY=0.7 * h, soundVizWd=0.45 * w, soundVizHt=0.5 * h;
let volNode, delayVolNode;
let delay, delayTimeLFO;
let fundWave, delayWave;


function setup() {
    createCanvas(w, h);

    volNode = new Tone.Volume().toDestination();
    delayVolNode = new Tone.Volume().toDestination();

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    recorder = new Tone.Recorder();     //  set up Tone recorder
    mic.connect(recorder);      //  connect microphone output to Tone recorder object

    recordButton = createButton('RECORD');      //  record button
    recordButton.position(recButX, recButY);
    recordButton.size(recButWd, recButHt);
    recordButton.mousePressed(recordIn);    

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

    delayTimeLFO.start();

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
        player.connect(delay);      //  connect

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