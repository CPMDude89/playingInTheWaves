let w=window.innerWidth, h=window.innerHeight;
let recButX = w * 0.7, recButY = 0.2 * h, recButWd = 0.1 * w, recButHt = 0.08 * h;
let mic;
let sampler1, sampler2, sampler3;
let limiter, volNode;

function preload() {
    limiter = new Tone.Limiter(-1).toDestination();
    //volNode = new Tone.Volume().connect(limiter);
    volNode = new Tone.Volume().toDestination();
    effectBus = new Tone.Volume().connect(limiter);
}

function setup() {
    canv = createCanvas(w, h);

    mic = new Tone.UserMedia();
    mic.open();

    sampler1 = new SamplerButton(recButX, recButY, recButWd, recButHt);
    sampler2 = new SamplerButton(recButX, 2.25 * recButY, recButWd, recButHt);    
    sampler3 = new SamplerButton(recButX, 3.5 * recButY, recButWd, recButHt);

    sampler1.player.connect(volNode);
    mic.connect(sampler1.recorder);

    sampler2.player.connect(volNode);
    mic.connect(sampler2.recorder);

    sampler3.player.connect(volNode);
    mic.connect(sampler3.recorder);

    controls1 = new PlaygroundControls(recButX - (0.5 * recButWd), recButY, recButWd, recButHt, sampler1.player, effectBus);
    controls1.delay.connect(effectBus);
    //controls1.ampModLFO.connect(volNode.volume);


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
    text('--LONG LOOP--\n10 SECONDS OR MORE', 0.82 * w, 3.5 * recButY + (0.5 * recButHt));

    if (sampler1.state == 'recording') {
        fill(255, 0, 0);
        circle(recButX + (0.5 * recButWd), recButY - (0.5 * recButHt), 0.4 * recButHt);
    }
}

