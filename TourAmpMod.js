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
let recButX=(0.11 * w), recButY=(0.25 * h), recButWidth=(0.1 * w), recButHeight=(0.1 * h);
let lfoVizRectX=(0.85 * w), lfoVizRectY=(recButY), lfoVizRectWidth=(0.03 * w), lfoVizRectHeight=(0.6 * h);
let analyzer;
let lfoFreqSlider, sliderWidth=(0.2 * w);

function setup() {
    createCanvas(w, h);     //  make p5 canvas

    inMic = new p5.AudioIn(); //  set up audio input (computer mic)
    inMic.start();

    recordButton = new AmplitudeModulation(recButX, recButY, recButWidth, recButHeight, inMic);

    analyzer = new Analyzer(0, 1);
    analyzer.setFreq(2);

    lfoFreqSlider = createSlider(0.08, 40, 2, 0.01);
    lfoFreqSlider.size(sliderWidth);
    lfoFreqSlider.position(lfoVizRectX - (sliderWidth / 2), 0.8 * lfoVizRectY);
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
    rect(lfoVizRectX, lfoVizRectY, lfoVizRectWidth, lfoVizRectHeight);

    if (recordButton.ampModActive) {
        analyzer.setFreq(lfoFreqSlider.value());

        let gain = analyzer.process();  //  assign output of amp mod osc to variable

        recordButton.soundFile.setVolume(gain, 0.01);   //  apply amp mod osc output to soundFile amplitude

        fill(100, 50, 150);
        circle((0.5 * lfoVizRectWidth) + lfoVizRectX, map(gain, 0, 1, (lfoVizRectY + lfoVizRectHeight), lfoVizRectY), 1.75 * lfoVizRectWidth);


    }

}