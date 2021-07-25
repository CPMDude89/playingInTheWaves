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
        this.player = new Tone.Player({
            fadeIn: 0.1,
            fadeOut: 0.1
        }); //  Tone player object to handle playback
        
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
            setTimeout(() => this.loop = new Tone.Loop((time) => {
                this.player.start();
            }, (this.player.buffer.length / this.player.buffer.sampleRate)),
            200);

            this.button.html('PLAY RECORDING');     //  change button text
            this.showControls();    //  send to function to show start over button
            this.state = 'play';    //  change string to keep track of process
        }

        else if (this.state == 'play') {    //  play recorded audio buffer
            this.button.html('STOP PLAYBACK');  //  change button text
            this.state = 'stop';    //  change string to keep track of process
            
            this.loop.start();     //   start event loop 
        }

        else if (this.state = 'stop') {
            this.button.html('PLAY RECORDING');     //  change button text
            this.state = 'play';    //  change string to keep track of process

            this.player.stop();     //  stop player
            this.loop.stop();       //  stop event loop
        }
    }

    showControls() {
        this.clearButton = createButton('START OVER');  //  create button to restart process
        this.clearButton.position(this.Xpos - (0.6 * this.butWd), this.Ypos);   
        this.clearButton.size(0.5 * this.butWd, this.butHt);
        this.clearButton.mousePressed(() => {
            this.button.html('RECORD');
            this.player.stop();
            this.loop.stop();
            this.state = 'ready';
            this.clearButton.remove();
        })
    }
}
//===================================================================================================================================================//
//===================================================================================================================================================//

/**
 * ForwardAndBackwardsSamplerButton class will extend the SamplerButton class
 * 
 * Main difference is this class has two players instead of one, and one will have a reversed buffer
 * This is because Tone.js Player object will not accept a playback rate of > 0, like p5.sound will
 * Instead of switching the playback rate to a negative number to go backwards, will fade volumes between 
 * forwards and backwards running buffers
 */
class ForwardsAndBackwardsSamplerButton extends SamplerButton {
    constructor (
        Xpos,   //  x-axis coordinate
        Ypos,   //  y-axis coordinate
        butWd,  //  button width
        butHt  //  button height
    ) {
        super(Xpos, Ypos, butWd, butHt);    //  inherit properties from parent class

        this.recorder = new Tone.Recorder();  //  Tone recorder object to handle user recording

        this.playerForward = new Tone.Player({  //  create forwards running player
            fadeIn: 0.1,
            fadeOut: 0.1,
            reverse: false,
            volume: 0
        });
        this.playerBackward = new Tone.Player({ //  create backwards running player
            fadeIn: 0.1,
            fadeOut: 0.1,
            reverse: true,
            volume: -100
        });
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
            this.playerForward.load(blob);      //  send audio blob to player, which will decode it to a ToneAudioBuffer https://tonejs.github.io/docs/14.7.77/Player#load
            this.playerBackward.load(blob);     //  same but load it to a reversed player

            setTimeout(() => this.loop = new Tone.Loop((time) => {
                this.playerForward.start();
                this.playerBackward.start();
            }, (this.playerForward.buffer.length / this.playerForward.buffer.sampleRate)),
            200);

            this.button.html('PLAY RECORDING');     //  change button text
            this.showControls();    //  send to function to show start over button
            this.state = 'play';    //  change string to keep track of process
        }

        else if (this.state == 'play') {    //  play recorded audio buffer
            this.button.html('STOP PLAYBACK');  //  change button text
            this.state = 'stop';    //  change string to keep track of process
            
            this.loop.start();     //   start event loop 
        }

        else if (this.state = 'stop') {
            this.player.stop();     //  stop playback
            this.button.html('PLAY RECORDING');     //  change button text
            this.state = 'play';    //  change string to keep track of process

            this.playerForward.stop();     //  stop player
            this.playerBackward.stop();     //  stop player
            this.loop.stop();       //  stop event loop
        }
    }
}
//===================================================================================================================================================//
//===================================================================================================================================================//

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
        binsAmt,    //  number of bins for waveform analysis, needs to be a power of 2 
        squareWindow      //  boolean to determine if window is a rectangle or square (square primarily for playback rate program)
    ) {
        this.Xpos = Xpos;
        this.Ypos = Ypos;
        this.scopeWd = scopeWd;
        this.scopeHt = scopeHt;
        this.binsAmt = binsAmt;
        this.squareWindow = squareWindow;

        this.wave = new Tone.Waveform();    //  set up new Tone Waveform object to do the analysis
        this.wave.size = this.binsAmt;      //  amount of definition in the wave


    }

    process() {     //  draw oscilloscope
        fill(0);    //  black
        rectMode(CENTER);   //  align rectangle to center
        if (this.squareWindow) {
            square(this.Xpos, this.Ypos, this.scopeWd);  //  create square backdrop for waveform drawing    
        }
        else {
            rect(this.Xpos, this.Ypos, this.scopeWd, this.scopeHt);  //  create rectangular backdrop for waveform drawing
        }

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
//===================================================================================================================================================//
//===================================================================================================================================================//

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

    getLFOPhase() { 
        return this.wave.getValue()[0].toFixed(2);
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