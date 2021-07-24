/**
 * File containing all custom classes designed for the 'Playing In The Waves' project
 * 
 * All class objects designed by Chris Duvall, 2021
 * 
 * Libraries used: 
 * 
 * p5.js:
 * https://p5js.org/
 * 
 * p5.sound:
 * https://p5js.org/reference/#/libraries/p5.sound
 * 
 * Tone.js:
 * https://tonejs.github.io/
 */

/**
 * This is the base class to record and play back audio from user's computer or phone
 * Make sure to do all the connections in the script this is used in
 * 
 * Based on p5.sound's SoundRecorder tutorial:
 * https://p5js.org/reference/#/p5.SoundRecorder
 */
class SamplerButton {
    constructor(
        Xpos,   //  x-axis coordinate
        Ypos,   //  y-axis coordinate
        butWd,  //  button width
        butHt  //  button height
    ) {
        this.Xpos = Xpos;
        this.Ypos = Ypos;
        this.butWd = butWd;
        this.butHt = butHt;

        this.recorder = new Tone.Recorder();  //  Tone recorder object to handle user recording
        this.player = new Tone.Player();  //  Tone player object to handle playback
        this.state = 'ready';   //  string to keep track of recording process and playback

        //  set up button
        this.button = createButton('RECORD');    //  p5 createButton()
        this.button.position(Xpos, Ypos);   //  button placement on canvas
        this.button.size(butWd, butHt);     //  button size
        this.button.mousePressed(() => this.process()); //  what happens when button is clicked
    }

    async process() {
        if (this.state == 'ready') {    //  if object is ready to record new audio in
            setTimeout(() => {this.recorder.start()}, 120);     //  wait 120 ms to avoid mouse click then begin recording
            this.button.html('STOP RECORDING');     //  change button text
            this.state = 'recording';   //  change string to keep track of process
        }

        else if (this.state == 'recording') {       //  stop recording and store audio
            let data = await this.recorder.stop();  //  receive audio data as a promise encoded as 'mimeType' https://tonejs.github.io/docs/14.7.77/Recorder#stop
            let blob = URL.createObjectURL(data);   //  store audio data as a blob, which sends a package back to the server for use
            this.player.load(blob);      //  send audio blob to player, which will decode it to a ToneAudioBuffer https://tonejs.github.io/docs/14.7.77/Player#load
            this.player.loop = true;    //  set player to loop

            this.button.html('PLAY RECORDING');     //  change button text
            this.showControls();    //  send to function to show start over button
            this.state = 'play';    //  change string to keep track of process
        }

        else if (this.state == 'play') {    //  play recorded audio buffer
            this.player.start();    //  play the audio
            this.button.html('STOP PLAYBACK');  //  change button text
            this.state = 'stop';    //  change string to keep track of process
        }

        else if (this.state = 'stop') {
            this.player.stop();     //  stop playback
            this.button.html('PLAY RECORDING');     //  change button text
            this.state = 'play';    //  change string to keep track of process
        }
    }

    showControls() {
        this.clearButton = createButton('START OVER');  //  create button to restart process
        this.clearButton.position(this.Xpos - (0.6 * this.butWd), this.Ypos);
        this.clearButton.size(0.5 * this.butWd, this.butHt);
        this.clearButton.mousePressed(() => {
            this.button.html('RECORD');
            this.player.stop();
            this.state = 'ready';
            this.clearButton.remove();
        })
    }
}

/**
 * Class object for a p5.js/Tone.js combination oscilloscope. 
 * Needs to be included in html file with BOTH p5.js and Tone.js
 * Make sure to do all the connections in the script this is used in
 * 
 * Derived largely from this tutorial:
 * https://www.youtube.com/watch?v=ddVrGY1dveY&t=1644s&ab_channel=DavidBouchard
 */
class OscScope {
    constructor (
        Xpos,   //  x-axis coordinate
        Ypos,   //  y-axis coordinate
        scopeWd,    //  visualizer width
        scopeHt,    //  visualizer height
        binsAmt    //  number of bins for waveform analysis, needs to be a power of 2 
    ) {
        this.Xpos = Xpos;
        this.Ypos = Ypos;
        this.scopeWd = scopeWd;
        this.scopeHt = scopeHt;
        this.binsAmt = binsAmt;

        this.wave = new Tone.Waveform();    //  set up new Tone Waveform object to do the analysis
        this.wave.size = this.binsAmt;      //  amount of definition in the wave
    }

    process() {     //  draw oscilloscope
        fill(0);    //  black
        rectMode(CENTER);   //  align rectangle to center
        rect(this.Xpos, this.Ypos, this.scopeWd, this.scopeHt);  //  create backdrop for waveform drawing

        stroke(255);        //  set up wave visualizer
        strokeWeight(3);
        noFill();
        let buffer = this.wave.getValue();  //  assign variable for array to analyze

        let start = 0;      //  find the starting point to stabalize wave
        for (let i = 1; i < buffer.length; i++) {
            if (buffer[i-1] < 0 && buffer[i] >= 0) {    //  find the point in the wave that equals 0
                start = i;                              //  by finding the two places in the buffer that go from negative to positive 
                break;      //  break out of loop
            }
        }
        let end = start + (0.5 * buffer.length);    //  set end point, and always fixed amount

        beginShape()    //  begin custom vertex shape
        for (let i = start; i < end; i++) {   //  iterate over returned array    
            let x = map(i, start, end, (this.Xpos - (0.5 * this.scopeWd)), (this.Xpos + (0.5 * this.scopeWd)));   
            let y = map(buffer[i], -1, 1, (this.Ypos - (0.5 * this.scopeHt)), (this.Ypos + (0.5 * this.scopeHt)));

            vertex(x,y);    //  assign to point in custom vertex shape
        }
        endShape();     //  finish custom vertex shape
    }
}


/**
 * This class is designed to make the current phase and frequency of an LFO visible.
 * A ball moves up and down over a vertical rectangle, where the top of the rectangle is max phase, and bottom is min phase.
 * At frequencies above 5Hz, the ball will loose coherence. But that's ok, it works so smoothly it's still effective.
 * The draw() loop in p5.js tries to run at 60 fps always, and since the visualizer is called inside the draw() loop,
 * it is limited to that frame rate
 * 
 * Needs to be included in html file with BOTH p5.js and Tone.js
 * Make sure to do all the connections in the script this is used in
 */
class LFOVisualizer {
    constructor (
        Xpos,   //  x-axis coordinate
        Ypos,   //  y-axis coordinate
        rectWd, //  rectangle width
        rectHt, //  rectangle height
        ballRed,    //  visualizer red value
        ballGreen,  //  visualizer green value
        ballBlue    //  visualizer blue value
    ) {
        this.Xpos = Xpos;
        this.Ypos = Ypos;
        this.rectWd = rectWd;
        this.rectHt = rectHt;
        this.ballRGB = color(ballRed, ballGreen, ballBlue);

        this.wave = new Tone.Waveform();    //  set up new waveform object to analyze LFO output, connect to LFO in script
    }

    setBallColor(r, g, b) {     //  change ball color
        this.ballRGB = color(r, g, b);
    }

    process() {     //  call in draw() loop for lfo visualization
        //  set up visualizer background (vertical rectangle)
        fill(0);        //  black
        rectMode(CORNER);   
        rect(this.Xpos, this.Ypos, this.rectWd, this.rectHt);     //  LFO visualizer vertical bar

        //  set up ball that represents LFO phase
        fill(this.ballRGB); //  ball color
        stroke(0);  //  black outline
        strokeWeight(2);    //  set outline

        //  set output of amp mod lfo to the y-axis of ball to visualize amp mod
        let AMBuffer = this.wave.getValue();    //  get amplitude array snapshot of signal
        let y = AMBuffer[0];    //  get first bin, this keeps the movement consistent
        //  map values to p5.js 'circle' object
        circle((0.5 * this.rectWd) + this.Xpos, map(y, 0, 1, (this.Ypos + this.rectHt), this.Ypos), 1.75 * this.rectWd);
    }
}