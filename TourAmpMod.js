/**
 * A part of Playing In The Waves' 'Tour'
 * This program will take in the user's input, and store it in a new audio buffer. 
 * Then it can be played back, and the amplitude of buffer playback will be attached to a p5.Oscillator
 * The phase of the LFO modulating the buffer's amplitude will be animated
 *          to help visualize how an LFO can affect a sound's volume
 * 
 */

let w = window.innerWidth;
let h = window.innerHeight;
let mic, recorder, soundFile, recordButton;
let recButX=(0.11 * w), recButY=(0.2 * h), recButWidth=(0.1 * w), recButHeight=(0.1 * h);
let lfoVizRectX=(0.85 * w), lfoVizRectY=(recButY), lfoVizRectWidth=(0.03 * w), lfoVizRectHeight=(0.6 * h);
let analyzer;
let lfoFreqSlider, sliderWidth=(0.6 * w);
let soundVizX=0.5 * w, soundVizY=0.7 * h, soundVizWidth=0.45 * w, soundVizHeight=0.5 * h;
let fft;
let testToneButton, testTone, testToneActive=false;

function setup() {
    createCanvas(w, h);     //  make p5 canvas

    inMic = new p5.AudioIn(); //  set up audio input (computer mic)
    inMic.start();

    recordButton = new AmplitudeModulation(recButX, recButY, recButWidth, recButHeight, inMic);

    //analyzer = new Analyzer(0, 1);
    //analyzer.setFreq(2);

    lfoFreqSlider = createSlider(0.1, 50, 2, 0.1);
    lfoFreqSlider.size(sliderWidth);
    lfoFreqSlider.position(0.2 * w, 0.4 * h);

    fft = new p5.FFT(0.8, 2048);

    testTone = new p5.Oscillator();
    
    testToneButton = createButton('TEST TONE');
    testToneButton.position(recButX, soundVizY);
    testToneButton.size(recButWidth, recButHeight);
    testToneButton.mousePressed(triggerTestTone);

}

function draw() {
    background(0, 150, 80);     // nice shade of forest green

    textAlign(CENTER);  //  set up page title
    textSize(40);
    fill(0);       
    text('Playing In The Waves:\nAmplitude Modulation', 0.5 * w, 0.05 * h); //  page title

    if (recordButton.recordActive) {     //  if button is recording
        fill(255, 0, 0);    //  red for record light
        circle((recButX + (0.5 * recButWidth)), (recButY - (0.4 * recButHeight)), 0.4 * recButHeight);
    }

    fill(0);
    rectMode(CORNER);
    rect(lfoVizRectX, lfoVizRectY, lfoVizRectWidth, lfoVizRectHeight);

    if (recordButton.ampModActive) {
        recordButton.analyzer.setFreq(lfoFreqSlider.value());    //  continuously check for new frequency

        let gain = recordButton.analyzer.process();  //  assign output of amp mod osc to variable    

        

        fill(100, 50, 150); //  nice purple color
        //  set output of amp mod lfo to the y-axis of ball to visualize amp mod
        circle((0.5 * lfoVizRectWidth) + lfoVizRectX, map(gain, 0, 1, (lfoVizRectY + lfoVizRectHeight), lfoVizRectY), 1.75 * lfoVizRectWidth);
        
        fill(0);
        textSize(40);
        text(lfoFreqSlider.value() + ' Hz', 0.5 * w, 0.38 * h);
    }

    fill(0);    //  black
    rectMode(CENTER);   //  align rectangle to center
    rect(soundVizX, soundVizY, soundVizWidth, soundVizHeight);  //  create backdrop for waveform drawing

    if (recordButton.state > 1) {
        /*
        let spectrum = fft.analyze();
        stroke(100, 50, 150)
        
        for (let i = 0; i < spectrum.length; i++) {
            let x = map(i, 0, spectrum.length, soundVizX - (0.5 * soundVizWidth), soundVizX + (0.5 * soundVizWidth));

            let y = map(spectrum[i], 0, 255, soundVizY + (0.5 * soundVizHeight), soundVizY - (0.5 * soundVizHeight));

            line(x, soundVizY + (0.5 * soundVizHeight), x, y);
        }
        */
        
        let wave = fft.waveform();  //  create fft snapshot of audio file
        
        noFill();   //  set up for vertex
        beginShape();
        stroke(255);

        for (let i = 0; i < wave.length; i++) {
            let x = map(i, 0, wave.length, soundVizX - (0.5 * soundVizWidth), soundVizX + (0.5 * soundVizWidth));   //  get x value

            let y = map(wave[i], -1, 1, soundVizY - soundVizHeight, soundVizY + soundVizHeight);     //  get y value

            vertex(x, y);
        }

        endShape();
        noStroke();
        
    }
}

function triggerTestTone() {
    if (!testToneActive) {
        testTone.start();
        testTone.amp(1.0);
        testTone.freq(200);
        testTone.amp(recordButton.analyzer.scaledOsc);
    }

    else {
        testTone.stop();
    }
}