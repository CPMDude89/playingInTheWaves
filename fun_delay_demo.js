let w = window.innerWidth, h = window.innerHeight;
let soundFile1, soundFile2, mic, recorder;
let state1=0, state2=0;
let recordButton1, recordButton2;
let delayButton1, delayButton2, delayActive1=false, delayActive2=false;
let loopButton1, loopButton2, loopActive1=false, loopActive2=false;

function setup() {
    createCanvas(w, h);

    mic = new p5.AudioIn();
    mic.start();

    recorder = new p5.SoundRecorder();
    recorder.setInput(mic);

    soundFile1 = new p5.SoundFile();
    soundFile2 = new p5.SoundFile();

    recordButton1 = createButton('RECORD 1 START');
    recordButton1.position(1.5 * w/4, h/4);
    recordButton1.size(w/4, h/5);
    recordButton1.mousePressed(record1);

    recordButton2 = createButton('RECORD 2 START');
    recordButton2.position(1.5 * w/4, 2 * (h/4));
    recordButton2.size(w/4, h/5);
    recordButton2.mousePressed(record2);

    delay1 = new p5.Delay()
    delay2 = new p5.Delay();
    
}

function draw() {
    background(50, 200, 10);

    fill(0);
    textSize(35);
    textAlign(CENTER);
    text('HAVE FUN LOOPING!', w/2, h/9);
}

function record1 () {
     //  make sure audio is good to go
     userStartAudio();
     //  make sure user has mic enabled
     if (state1 === 0 && mic.enabled) {
         //  record into p5.SoundFile after 80 milliseconds to get past mouse click
         setTimeout(function() {recorder.record(soundFile1, 10)}, 120);
         recordButton1.html('RECORDING!')
         state1++;
     }
     else if(state1 === 1) {
        //  stop recorder and 
        //  send result to soundFile
        recorder.stop();
        setTimeout(function() {
            addDelayButton1();
            addLoopButton1();
        }, 100);
        recordButton1.html('PLAY RECORDING');
        state1++;
    }
    else if (state1 === 2) {
        soundFile1.play();
        soundFile1.jump(0);

        
        if (soundFile1.isLooping()) {
            recordButton1.html('STOP RECORDING');
            state1++;
        }
    }
    else if (state1 == 3 && soundFile1.isLooping() == true){
        soundFile1.stop();

        recordButton1.html('PLAY RECORDING');

        state1--;
    }
}

function addDelayButton1() {
    delayButton1 = createButton('DELAY ON')
    delayButton1.position(2.6 * (w/4), h/4);
    delayButton1.size(w/6, h/5);
    delayButton1.mousePressed(activateDelay1);
}

function activateDelay1() {
    if (!delayActive1) {
        delayActive1 = true;
        delayButton1.html('DELAY OFF');
    }
    else {
        delayActive1 = false;
        delayButton1.html('DELAY ON');
    }

    if (delayActive1) {
        delay1.connect();
        delay1.process(soundFile1, 0.8, 0.7, 3000);
        delay1.drywet(1);
    }
    else {
        delay1.drywet(0);
    }
}

function addLoopButton1() {
    loopButton1 = createButton('LOOPING ON');
    loopButton1.position(w/6, h/4);
    loopButton1.size(w/6, h/5);
    loopButton1.mousePressed(activateLooping1);
}

function activateLooping1() {
    if (!loopActive1) {
        soundFile1.setLoop(true);
        loopButton1.html('LOOPING OFF');
        loopActive1 = true;
    }
    else {
        soundFile1.setLoop(false);
        loopButton1.html('LOOPING ON');
        loopActive1 = false;
    }

    if (soundFile1.isPlaying() && state1 == 3) {
        soundFile1.stop();
        recordButton1.html('PLAY RECORDING');
        state1 = 2;
    }
}

function record2 () {
    //  make sure audio is good to go
    userStartAudio();
    //  make sure user has mic enabled
    if (state2 === 0 && mic.enabled) {
        //  record into p5.SoundFile after 80 milliseconds to get past mouse click
        setTimeout(function() {recorder.record(soundFile2, 10)}, 120);
        recordButton2.html('RECORDING!')
        state2++;
    }
    else if(state2 === 1) {
       //  stop recorder and 
       //  send result to soundFile
       recorder.stop();
       setTimeout(function() {
           addDelayButton2();
           addLoopButton2();
       }, 100);
       recordButton2.html('PLAY RECORDING');
       state2++;
   }
   else if (state2 === 2) {
       soundFile2.play();
       soundFile2.jump(0);

       if (soundFile2.isLooping()) {
           recordButton2.html('STOP RECORDING');
           state2++;
       }
   }
   else if (state2 == 3 && soundFile2.isLooping() == true){
       soundFile2.stop();

       recordButton2.html('PLAY RECORDING');

       state2--;
   }
}

function addDelayButton2() {
   delayButton2 = createButton('DELAY ON')
   delayButton2.position(2.6 * (w/4), h/2);
   delayButton2.size(w/6, h/5);
   delayButton2.mousePressed(activateDelay2);
}

function activateDelay2() {
    if (!delayActive2) {
        delayActive2 = true;
        delayButton2.html('DELAY OFF');
    }
    else {
        delayActive2 = false;
        delayButton2.html('DELAY ON');
    }

    if (delayActive2) {
        delay2.connect();
        delay2.process(soundFile2, 0.6, 0.7, 3000);
        delay2.drywet(1);
    }
    else {
        delay2.drywet(0);
    }
}

function addLoopButton2() {
   loopButton2 = createButton('LOOPING ON');
   loopButton2.position(w/6, h/2);
   loopButton2.size(w/6, h/5);
   loopButton2.mousePressed(activateLooping2);
}

function activateLooping2() {
   if (!loopActive2) {
       soundFile2.setLoop(true);
       loopButton2.html('LOOPING OFF');
       loopActive2 = true;
   }
   else {
       soundFile2.setLoop(false);
       loopButton2.html('LOOPING ON');
       loopActive2 = false;
   }

   if (soundFile2.isPlaying() && state2 == 3) {
       soundFile2.stop();
       recordButton2.html('PLAY RECORDING');
       state2 = 2;
   }
}