let osc;
let lfo;
let playButton;
let stopButton;
let ampButton;
let lfoButton;
let lfoSlider;
let ampSlider;
let ampModToggle = false;
let oscAmpModToggle = false;
let oscAmpModSlider;
let phase = 0;

function setup() {
    let canv = createCanvas(500, 500);
    
    osc = new p5.Oscillator();
    lfo = new p5.Oscillator();

    playButton = createButton('PLAY');
    playButton.mousePressed(playOsc);

    stopButton = createButton('STOP');
    stopButton.mousePressed(stopOsc);

    ampButton = createButton('ENGAGE AMP MOD VIA DRAW');
    ampButton.mousePressed(activateAmpMod);

    lfoButton = createButton('ENGAGE AMP MOD VIA LFO');
    lfoButton.mousePressed(activateOscAmpMod);

    lfoSlider = createSlider(100, 500, 300, 1.0);

    ampSlider = createSlider(0.1, 10, 4.0, 0.1);

    oscAmpModSlider = createSlider(0.1, 50, 15, 0.1);
}

function playOsc() {
    osc.start();
}

function stopOsc() {
    osc.stop();
}

function activateAmpMod() {
    if (!ampModToggle) {
        ampModToggle = true;
    }
    else {
        ampModToggle = false;
    }
}

function activateOscAmpMod() {
    if (!oscAmpModToggle) {
        oscAmpModToggle = true;
        lfo.start()
        lfo.disconnect();
        //lfo.connect(osc);
        lfo.amp(1.0);
        lfo.freq(oscAmpModSlider.value());
    }
    else {
        oscAmpModToggle = false;
        lfo.stop();
    }
}

function draw() {
    background(0);

    osc.freq(lfoSlider.value());

    translate(width/2, height/2);
    fill(252, 238, 33);

    let ampMod = map(sin(phase), -1, 1, 0, 1);
    //console.log(r);

    //circle(100, 100, ampMod * 100);

    phase += ampSlider.value();
    console.log(ampSlider.value());
    //console.log("ampMod is: " + ampMod);

    if (ampModToggle) {
        osc.amp(ampMod, 0.09);
    }

    if (oscAmpModToggle) {
        lfo.freq(oscAmpModSlider.value());
        
        osc.amp(lfo);
    }
}


