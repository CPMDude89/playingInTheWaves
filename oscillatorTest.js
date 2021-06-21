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
let ampModFreq = 0;
let phase = 0;
let startTime = 0;
let checkTime = 0;
let timeText = "";

function setup() {
    let canv = createCanvas(window.innerWidth, 800);
    
    osc = new p5.Oscillator();
    lfo = new p5.Oscillator();

    playButton = createButton('PLAY');
    playButton.mousePressed(playOsc);

    stopButton = createButton('STOP');
    stopButton.mousePressed(stopOsc);

    lfoButton = createButton('ENGAGE AMP MOD VIA LFO');
    lfoButton.mousePressed(activateOscAmpMod);

    lfoSlider = createSlider(100, 500, 300, 1.0);

    oscAmpModSlider = createSlider(0.1, 40, 15, 0.1);

    startTime = millis();
    canv.mousePressed(calcTimeDiff);
}

function calcTimeDiff() {
    checkTime = (millis() - startTime) * 0.001;
    
    textTime = "Since running this program, this many milliseconds have gone by: " + checkTime;
    
    textSize(50);
    fill(50);

    text("Since running this program, this many milliseconds have gone by: " + checkTime, 100, 100);
    console.log("Since running this program, this many milliseconds have gone by: " + checkTime);
}

function playOsc() {
    osc.start();
}

function stopOsc() {
    osc.stop();
}

function activateOscAmpMod() {
    if (!oscAmpModToggle) {
        oscAmpModToggle = true;
        lfo.start()
        lfo.disconnect();
        lfo.amp(1.0);
        lfo.freq(oscAmpModSlider.value());
        ampModFreq = oscAmpModSlider.value();
    }
    else {
        oscAmpModToggle = false;
        lfo.stop();
    }
}

function draw() {
    background(0);



    osc.freq(lfoSlider.value());

    fill(252, 238, 33);

    textSize(30);
    text(timeText, width / 2, height / 2);

    textSize(50);
    text("The current amp mod frequency is: " + oscAmpModSlider.value(), width / 8, height / 3);

    if (oscAmpModToggle) {
        lfo.freq(oscAmpModSlider.value());
        osc.amp(lfo);
    }

    let y = map(sin(phase), -1, 1, 0, height);

    square(
        5 * (width / 6),
        y,
        100
        )

    let increment = ampModFreq / 60;
    phase += increment;
    /*
    if (phase == 1.0)
    {
        phase = 0;
    }
    */

}


