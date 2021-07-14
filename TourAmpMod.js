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
let ampModButton, AMButWidth=recButWidth, AMButHeight=recButHeight, AMButX=(recButX + (1.15 * AMButWidth) ), AMButY=(recButY);
let state = 0;
let ampModActive = false;
let osc;


function setup() {
    createCanvas(w, h);     //  make p5 canvas

    inMic = new p5.AudioIn(); //  set up audio input (computer mic)
    inMic.start();

    recordButton = new RecordButton(recButX, recButY, recButWidth, recButHeight, inMic);
    /*
    osc = new p5.Oscillator();  //  create modulator signal
    osc.start();
    osc.disconnect();   //  remove oscillator from main output
    osc.scale(-1, 1, 0, 1);     //  scale oscillator to make more sense in terms of amplitude
    osc.freq(15);
    osc.amp(1);

*/

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


}


/*
function activateAmpMod() {     //  apply LFO output to soundFile's amplitude
    if (!ampModActive) {    //  if amp mod is not active, apply LFO to gain and flip boolean
        osc.start();
        recordButton.soundFile.setVolume(osc);   //  apply output oscillator to audio files volume
        ampModButton.html('DEACTIVATE\nAMP MOD');
        ampModActive = true;
    }

    else {    //  if amp mod is active, turn it off and flip boolean
        osc.stop();
        recordButton.soundFile.setVolume(1.0);   //  set audio file's gain to static number
        ampModButton.html('ACTIVATE\nAMP MOD');
        ampModActive = false;
    }

}
*/