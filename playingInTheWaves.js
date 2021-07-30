let w=window.innerWidth, h=window.innerHeight;
let recButX = w * 0.5, recButY = 0.25 * h, recButWd = 0.1 * w, recButHt = 0.08 * h;
let mic;
let sampler1, sampler2, sampler3;
let limiter, volNode;

function preload() {
    limiter = new Tone.Limiter(-1).toDestination();
    volNode = new Tone.Volume().connect(limiter);
}

function setup() {
    canv = createCanvas(w, h);

    mic = new Tone.UserMedia();
    mic.open();

    sampler1 = new SamplerButton(recButX - (0.5 * recButWd), recButY, recButWd, recButHt);
    sampler2 = new SamplerButton(recButX - (0.5 * recButWd), 2 * recButY, recButWd, recButHt);    
    sampler3 = new SamplerButton(recButX - (0.5 * recButWd), 3 * recButY, recButWd, recButHt);

    sampler1.player.connect(volNode);
    mic.connect(sampler1.recorder);

    sampler2.player.connect(volNode);
    mic.connect(sampler2.recorder);

    sampler3.player.connect(volNode);
    mic.connect(sampler3.recorder);

    Tone.Transport.start();
}

function draw() {
    background(0, 150, 80);

    noStroke();
    textAlign(CENTER);
    fill(0);
    textSize(40);
    text('Playing In The Waves: An Accessible, Play-Based Approach to Algorithmic Sound Design', recButX, 0.1 * h);

    if (sampler1.state == 'recording') {
        fill(255, 0, 0);
        circle(recButX, recButY - (0.5 * recButHt), 0.4 * recButHt);
    }

}