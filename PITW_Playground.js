let w=window.innerWidth, h=window.innerHeight;
let recButX = w * 0.7, recButY = 0.2 * h, recButWd = 0.1 * w, recButHt = 0.08 * h;
let mic;
let sampler1, sampler2, sampler3;
let limiter, volNode1, volNode2, volNode3;

function preload() {
    limiter = new Tone.Limiter(-1).toDestination();

    volNode1 = new Tone.Volume(-6).connect(limiter);
    //volNode2 = new Tone.Volume(-6).connect(limiter);
    //volNode3 = new Tone.Volume(-6).connect(limiter);

    reverbBus = new Tone.Volume(-1).connect(limiter);
    reverb = new Tone.Reverb({
        decay: 5,
        wet: 1
    }).connect(reverbBus);

    effectBus1 = new Tone.Volume(-4).connect(limiter);
    //effectBus2 = new Tone.Volume(-4).connect(limiter);
    //effectBus3 = new Tone.Volume(-4).connect(limiter);
}

function setup() {
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
    
    controls1 = new PlaygroundControls(recButX - (0.5 * recButWd), recButY, recButWd, recButHt, sampler1.player, reverb);
    controls1.connectToBus(effectBus1, reverbBus);

    controls2 = new PlaygroundControls(recButX - (0.5 * recButWd), 2.25 * recButY, recButWd, recButHt, sampler2.player, reverb);
    controls2.connectToBus(effectBus1, reverbBus);
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

    
    controls3 = new PlaygroundControls(recButX - (0.5 * recButWd), 3.5 * recButY, recButWd, recButHt, sampler3.player, reverb);
    controls3.connectToBus(effectBus1, reverbBus);
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
    text('--MEDIUM LOOP--\n7 SECONDS OR LESS', 0.82 * w, 2.25 * recButY + (0.5 * recButHt));
    text('--LONG LOOP--\n15 SECONDS OR LESS', 0.82 * w, 3.5 * recButY + (0.5 * recButHt));

    if (sampler1.state == 'recording') {
        fill(255, 0, 0);
        circle(recButX + (0.5 * recButWd), recButY - (0.5 * recButHt), 0.4 * recButHt);
    }

    controls1.checkForActivity();
    controls2.checkForActivity();
    controls3.checkForActivity();
    
    

}

