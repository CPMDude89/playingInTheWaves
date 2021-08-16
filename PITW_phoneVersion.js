/**
 * This script will contain the mobile-scaled version of Playing In The Waves
 * 
 * The primary version, the Playground, as lots of buttons laid out horizontally. 
 * This is great for computer screens, but bad for phone screens which are vertical. 
 * 
 * This program will have significantly less functionality than the Playground,
 * but at least among my personal friends and family, will by far 
 * be the most accessed.
 * 
 */

let w=window.innerWidth, h=window.innerHeight;
let mic;
let recButX=(0.1 * w), recButY=(0.13 * h), recButWd=(0.8 * w), recButHt=(0.2 * h);
let sampler1, sampler2, controls1, controls2;
let volNode1, volNode2, effectBus, limiter;
let delay;
let ampModLFO;
//let stockSample1, stockSample1Button;

function preload() {
    limiter = new Tone.Limiter(-1).toDestination();
    volNode1 = new Tone.Volume().connect(limiter);
    volNode2 = new Tone.Volume().connect(limiter);
    effectBus = new Tone.Volume().connect(limiter);
}

function setup() {
    createCanvas(w,h);

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    //  new SamplerButton instances to record user input
    sampler1 = new SamplerButton(recButX, recButY, recButWd, recButHt);  
    sampler1.player.connect(volNode1);
    buttonSignal1 = new SignalCircle(recButX + (0.5 * recButWd), recButY - (0.2 * recButHt), 0.3 * recButHt);

    sampler2 = new SamplerButton(recButX, (recButY + (recButHt * 2.1)), recButWd, recButHt);
    sampler2.player.connect(volNode2);
    buttonSignal2 = new SignalCircle(recButX + (0.5 * recButWd), (recButY + (recButHt * 2.2)) - (0.3 * recButHt), 0.3 * recButHt);

    mic.connect(sampler1.recorder);      //  connect microphone output to Tone recorder object
    mic.connect(sampler2.recorder);      

    controls1 = new PhoneControls(recButX, recButY, recButWd, recButHt, sampler1.player, volNode1);

    controls2 = new PhoneControls(recButX, (recButY + (recButHt * 2.1)), recButWd, recButHt, sampler2.player, volNode2);
    controls2.delayTimeLFO.frequency.value = 0.08;
    controls2.delayTimeLFO.min = 0.03;
    controls2.delayTimeLFO.max = 1;
    controls2.playbackRateIncrement = 0.02;

    controls1.connectToBus(effectBus);
    controls2.connectToBus(effectBus);

    stockSample1Active = false;
    sampler1.sampleActiveArray.push(stockSample1Active);
    stockSample1Button = createButton('SAMPLE 1');
    stockSample1Button.position(recButX + (recButWd * 0.55), recButY + (1.05 * recButHt));
    stockSample1Button.size(recButWd * 0.2, recButHt * 0.45);
    stockSample1Button.mousePressed(() => {
        sampler1.clearSampleActivity(0);
        sampler1.player.load("./sounds/snaps.wav");
        sampler1.button.html('PLAY SAMPLE 1');
        sampler1.sampleLoaded = true;
        sampler1.showControls();
        sampler1.state = 'play';
    })
    sample1Signal = new SignalCircle(recButX + (recButWd * 0.52), (recButHt * 0.225) + recButY + (1.05 * recButHt), 0.3 * recButHt);

    stockSample2Active = false;
    sampler1.sampleActiveArray.push(stockSample2Active);
    stockSample2Button = createButton('SAMPLE 2');
    stockSample2Button.position(recButX + (recButWd * 0.55), recButY + (1.52 * recButHt));
    stockSample2Button.size(recButWd * 0.2, recButHt * 0.45);
    stockSample2Button.mousePressed(() => {
        sampler1.clearSampleActivity(1);
        sampler1.player.load("./sounds/slinky_lazer.wav");
        sampler1.button.html('PLAY SAMPLE 2');
        sampler1.sampleLoaded = true;
        sampler1.showControls();
        sampler1.state = 'play';
    })
    sample2Signal = new SignalCircle(recButX + (recButWd * 0.52), (recButHt * 0.225) + recButY + (1.52 * recButHt), 0.3 * recButHt);

    stockSample3Active = false;
    sampler1.sampleActiveArray.push(stockSample3Active);
    stockSample3Button = createButton('SAMPLE 3');
    stockSample3Button.position(recButX + (recButWd * 0.79), recButY + (1.05 * recButHt));
    stockSample3Button.size(recButWd * 0.2, recButHt * 0.45);
    stockSample3Button.mousePressed(() => {
        sampler1.clearSampleActivity(2);
        sampler1.player.load("./sounds/CD_h_gibberish_edit_4.wav");
        sampler1.button.html('PLAY SAMPLE 3');
        sampler1.sampleLoaded = true;
        sampler1.showControls();
        sampler1.state = 'play';
    })
    sample3Signal = new SignalCircle(recButX + (recButWd * 1.02), (recButHt * 0.225) + recButY + (1.05 * recButHt), 0.3 * recButHt);

    stockSample4Active = false;
    sampler1.sampleActiveArray.push(stockSample4Active);
    stockSample4Button = createButton('SAMPLE 4');
    stockSample4Button.position(recButX + (recButWd * 0.79), recButY + (1.52 * recButHt));
    stockSample4Button.size(recButWd * 0.2, recButHt * 0.45);
    stockSample4Button.mousePressed(() => {
        sampler1.clearSampleActivity(3);
        sampler1.player.load("./sounds/lazer_chargeUp.wav");
        sampler1.button.html('PLAY SAMPLE 4');
        sampler1.sampleLoaded = true;
        sampler1.showControls();
        sampler1.state = 'play';
    })
    sample4Signal = new SignalCircle(recButX + (recButWd * 1.02), (recButHt * 0.225) + recButY + (1.52 * recButHt), 0.3 * recButHt);

    Tone.Transport.start();
}

function draw() {
    background(0, 150, 80);     //  background color

    noStroke();     //  set up title text
    textAlign(CENTER);
    textSize(30);
    fill(0);
    text('Playing In The Waves', 0.5 * w, 0.05 * h);     //  title text

    if (sampler1.state == 'recording') {
        buttonSignal1.drawRecordingCircle();
    }

    if (sampler2.state == 'recording') {
        buttonSignal2.drawRecordingCircle();
    }

    if (sampler1.player.state == 'started') {
        buttonSignal1.drawActiveCircle();
    }

    if (sampler2.player.state == 'started') {
        buttonSignal2.drawActiveCircle();
    }

    if (sampler1.sampleActiveArray[0] == true) {
        sample1Signal.drawActiveCircle();
    }

    if (sampler1.sampleActiveArray[1] == true) {
        sample2Signal.drawActiveCircle();
    }

    if (sampler1.sampleActiveArray[2] == true) {
        sample3Signal.drawActiveCircle();
    }

    if (sampler1.sampleActiveArray[3] == true) {
        sample4Signal.drawActiveCircle();
    }
    

    controls1.checkForActivity();
    controls2.checkForActivity();
}
