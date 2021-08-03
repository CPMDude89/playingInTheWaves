let w=window.innerWidth, h=window.innerHeight;
let recButX = w * 0.7, recButY = 0.2 * h, recButWd = 0.1 * w, recButHt = 0.08 * h;
let mic;
let sampler1, sampler2, sampler3;
let limiter, volNode1, volNode2, volNode3, effectBus;
let longSample1
let volSlider1, volSlider2, volSlider3;
let reverb;
let YDepth, XFreq;
let tourLink;

function preload() {
    limiter = new Tone.Limiter(-1).toDestination();

    reverb = new Tone.Reverb(4).toDestination();

    volNode1 = new Tone.Volume(-6).connect(limiter);
    volNode2 = new Tone.Volume(-6).connect(limiter);
    volNode3 = new Tone.Volume(-6).connect(limiter);

    effectBus = new Tone.Volume(-4).connect(limiter);
}

function setup() {
    frameRate(45);

    canv = createCanvas(w, h);

    mic = new Tone.UserMedia();
    mic.open();

    sampler1 = new SamplerButton(recButX, recButY, recButWd, recButHt);
    sampler2 = new SamplerButton(recButX, 2.25 * recButY, recButWd, recButHt);    
    sampler3 = new SamplerButton(recButX, 3.5 * recButY, recButWd, recButHt);

    sampler1.player.connect(volNode1);
    mic.connect(sampler1.recorder);
    
    sampler2.player.connect(volNode1);
    mic.connect(sampler2.recorder);

    sampler3.player.connect(volNode1);
    mic.connect(sampler3.recorder);
    
    controls1 = new PlaygroundControls(recButX, recButY, recButWd, recButHt, sampler1.player, volNode1, reverb);
    controls1.connectToBus(effectBus);

    controls2 = new PlaygroundControls(recButX, 2.25 * recButY, recButWd, recButHt, sampler2.player, volNode2, reverb);
    controls2.connectToBus(effectBus);

    controls2.delay.delayTime.value = 0.5;
    controls2.delayTimeLFO.frequency.value = 0.08;
    controls2.delayTimeLFO.min = 0.05;
    controls2.delayTimeLFO.max = 0.7;
    controls2.ampModLFOModulator.frequency.value = 0.04;
    controls2.ampModLFOModulator.min = 1;
    controls2.ampModLFOModulator.max = 300;
    controls2.filterSweep.frequency.value = 10;
    controls2.filterSweep.octaves = 4.5;
    controls2.filterSweep.filter.Q.value = 4;
    controls2.freqShifterLFO.frequency.value = 0.05;
    controls2.freqShifterLFO.min = -500;
    controls2.freqShifterLFO.max = 400;
    controls2.pannerFreqLFO.frequency.value = 0.1;
    controls2.pannerFreqLFO.min = 0.5;
    controls2.pannerFreqLFO.max = 3;

    controls3 = new PlaygroundControls(recButX, 3.5 * recButY, recButWd, recButHt, sampler3.player, volNode3, reverb);
    controls3.connectToBus(effectBus);

    controls3.delay.delayTime.value = 0.5;
    controls3.delay.feedback.value = 0.5;
    controls3.delayTimeLFO.frequency.value = 0.03;
    controls3.delayTimeLFO.min = 0.04;
    controls3.delayTimeLFO.max = 1;
    controls3.ampModLFOModulator.frequency.value = 0.05;
    controls3.ampModLFOModulator.min = 2;
    controls3.ampModLFOModulator.max = 250;
    controls3.filterSweep.frequency.value = 15;
    controls3.filterSweep.baseFrequency = 100
    controls3.filterSweep.octaves = 5;
    controls3.filterSweep.filter.Q.value = 7;
    controls3.freqShifterLFO.frequency.value = 0.03;
    controls3.freqShifterLFO.min = -500;
    controls3.freqShifterLFO.max = 600;
    controls3.pannerFreqLFO.frequency.value = 0.07;
    controls3.pannerFreqLFO.min = 0.08;
    controls3.pannerFreqLFO.max = 1;
    controls3.panner.depth.value = 1;

    shortSample1Button = createButton('SHORT SAMPLE 1');
    shortSample1Button.position(recButX, (recButY) + 1.7 * recButHt);
    shortSample1Button.size(0.75 * recButWd, 0.75 * recButHt);
    shortSample1Button.mousePressed(() => {
        sampler1.player.load("./sounds/martina_3.wav");
        sampler1.button.html('PLAY SAMPLE 1');
        sampler1.sampleLoaded = true;
        sampler1.showControls();
        sampler1.state = 'play';
    })

    mediumSample1Button = createButton('MED SAMPLE 1');
    mediumSample1Button.position(recButX, (2.25 * recButY) + 1.7 * recButHt);
    mediumSample1Button.size(0.75 * recButWd, 0.75 * recButHt);
    mediumSample1Button.mousePressed(() => {
        sampler2.player.load("./sounds/martina_2.wav");
        sampler2.button.html('PLAY SAMPLE 1');
        sampler2.sampleLoaded = true;
        sampler2.showControls();
        sampler2.state = 'play';
    })

    longSample1Button = createButton('LONG SAMPLE 1');
    longSample1Button.position(recButX, (3.5 * recButY) + 1.7 * recButHt);
    longSample1Button.size(0.75 * recButWd, 0.75 * recButHt);
    longSample1Button.mousePressed(() => {
        sampler3.player.load("./sounds/martina_1.wav");
        sampler3.button.html('PLAY SAMPLE 1');
        sampler3.sampleLoaded = true;
        sampler3.showControls();
        sampler3.state = 'play';
    })

    tourLink = createA('https://cpmdude89.github.io/playingInTheWaves/TourPlayRate.html', 'TAKE THE TOUR');
    tourLink.position(0.05 * w, 0.05 * h);

    Tone.Transport.start();
}

function draw() {
    background(0, 150, 80);

    noStroke();
    textAlign(CENTER);
    fill(0);
    textSize(40);
    text('Playing In The Waves: Playground', 0.5 * w, 0.1 * h);

    textAlign(LEFT);
    textSize(25)
    text('--SHORT LOOP--\n2 SECONDS OR LESS', 0.82 * w, recButY + (0.5 * recButHt));
    text('--MEDIUM LOOP--\n5 SECONDS OR LESS', 0.82 * w, 2.25 * recButY + (0.5 * recButHt));
    text('--LONG LOOP--\n10 SECONDS OR LESS', 0.82 * w, 3.5 * recButY + (0.5 * recButHt));

    if (sampler1.state == 'recording') {
        fill(255, 0, 0);
        circle(recButX + (0.5 * recButWd), recButY - (0.5 * recButHt), 0.4 * recButHt);
    }

    if (sampler2.state == 'recording') {
        fill(255, 0, 0);
        circle(recButX + (0.5 * recButWd), 2.25 * recButY - (0.5 * recButHt), 0.4 * recButHt);
    }

    if (sampler3.state == 'recording') {
        fill(255, 0, 0);
        circle(recButX + (0.5 * recButWd), 3.5 * recButY - (0.5 * recButHt), 0.4 * recButHt);
    }

    controls1.checkForActivity();
    controls2.checkForActivity();
    controls3.checkForActivity();

    
    

}



