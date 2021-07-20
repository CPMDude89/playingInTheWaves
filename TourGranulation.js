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

function setup() {
    createCanvas(w, h);

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
    
    if (state > 1) {
        stroke(0);
        strokeWeight(2);
        beginShape();
        for (let i = 0; i < audioBuffer.toArray(0).length; i += 200) {
            //console.log(audioBuffer.toArray(0)[i]);
            let x = map(i, 0, audioBuffer.toArray(0).length, 0, w);
            let y = map(audioBuffer.toArray(0)[i], -1, 1, h, 0);

            if (audioBuffer.toArray(0)[i] > 1 || audioBuffer.toArray(0)[i] < -1) {
                console.log(audioBuffer.toArray(0)[i]);
            }

            vertex(x, y);
        }
        endShape();
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

