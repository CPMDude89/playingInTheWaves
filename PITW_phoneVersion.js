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
let recButX=(0.1 * w), recButY=(0.1 * h), recButWd=(0.8 * w), recButHt=(0.3 * h);
let samplerButton1, samplerButton2;
let volNode1, volNode2, limiter;
let delay;
let ampModLFO;

function preload() {
    limiter = new Tone.Limiter(-4).toDestination();
    volNode1 = new Tone.Volume().connect(limiter);
    volNode2 = new Tone.Volume().connect(limiter);
}

function setup() {
    createCanvas(w,h);

    mic = new Tone.UserMedia();     //  set up microphone input
    mic.open();     //  turn on audio input

    //  new SamplerButton instances to record user input
    samplerButton1 = new SamplerButton(recButX, recButY, recButWd, recButHt);  
    samplerButton1.player.connect(volNode1);

    samplerButton2 = new SamplerButton(recButX, (recButY + (recButHt * 1.5)), recButWd, recButHt);
    samplerButton2.player.connect(volNode2);

    mic.connect(samplerButton1.recorder);      //  connect microphone output to Tone recorder object
    mic.connect(samplerButton2.recorder);      
}

function draw() {
    background(0, 150, 80);     //  background color

    noStroke();     //  set up title text
    textAlign(CENTER);
    textSize(40);
    fill(0);
    text('Playing In The Waves', 0.5 * w, 0.05 * h);     //  title text
}