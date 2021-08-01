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
            volume: -3,
            fadeIn: 0.2,
            fadeOut: 0.2,

        }); //  Tone player object to handle playback
        
        this.state = 'ready';   //  string to keep track of recording process and playback

        //  set up button
        this.button = createButton('RECORD');    //  p5 createButton()
        this.button.position(Xpos, Ypos);   //  button placement on canvas
        this.button.size(butWd, butHt);     //  button size
        this.button.mousePressed(() => this.process()); //  what happens when button is clicked

        this.loop = new Tone.Loop((time) => this.playLoop(), 0.5 );
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

            //setTimeout(() => {console.log(this.player.buffer.numberOfChannels);}, 200);
            

           

            /*
            setTimeout(() => this.loop = new Tone.Loop((time) => {
                this.player.start();
            }, 
            (this.player.buffer.length / this.player.buffer.sampleRate)),
            //this.player.buffer.duration,
            200);
            */



            setTimeout(() => {this.loop.interval = this.player.buffer.duration}, 200);

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

    playLoop(time) {
        this.player.start(0);

        this.player.stop("+this.player.duration");
        //this.loop.interval = 1.01 * this.player.buffer.duration;
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
 * GranulationSamplerButton will extend SamplerButton base class
 * 
 * Will get constant data in from p5.js draw() loop to adjust loop length.
 * Loop will start AND stop to take advantage of fadeIn and fadeOut methods in the Tone Player object
 * 
 */
class GranulationSlicer {
    constructor (
       left,    //  left side of the visualizer
       right,   //  right side of the visualizer
       top,     //  top side of the visualizer
       bottom,   //  bottom side of the visualizer
       vizWidth,     //  width of visualizer
       lineColorR,    //  color of slice lines
       lineColorG,    //  color of slice lines
       lineColorB    //  color of slice lines
    ) {
       this.left = left;
       this.right = right;
       this.top = top;
       this.bottom = bottom;
       this.vizWidth = vizWidth;
       this.lineColor = color(lineColorR, lineColorG, lineColorB);

       this.player = new Tone.Player();
       this.slice = new Tone.Loop(() => this.playSlice(), 0.3);

       this.minOffset = 0.01;
    }

    process() {
        this.mousePos = map(mouseX, this.left, this.right, 0, 1);  //  percentage x-axis in rectangle
 
        this.bufferTimeInSeconds = this.player.buffer.length / this.player.buffer.sampleRate;   //  total length in seconds of audio file

        this.maxOffset = 0.3 * this.bufferTimeInSeconds;  //  dynamically sets maximum loop length to 1/3 of total clip length

        //  offset is loop length, and dynamically set loop length to mouse's Y-axis position inside the visualizer
        this.offset = map(mouseY, this.bottom, this.top, this.minOffset, this.maxOffset); 
        
        //  this sends down to the grain loop, to dynamically re-size loop length depending on y-axis position. Only if a change has been made
        if (this.loopLength != this.offset) {
        this.loopLength = this.offset;
        }
        
        this.loopStartPoint = (this.mousePos * this.bufferTimeInSeconds);

        if (this.loopStartPoint > (this.bufferTimeInSeconds - this.offset)) {   //  range control
            this.loopStartPoint = this.bufferTimeInSeconds - this.offset;
        }

        this.offsetPercent = this.offset / this.bufferTimeInSeconds;   //  percent of buffer time (in seconds) the offset is
        this.offsetPercentInPixels = this.vizWidth * this.offsetPercent;     //  percent of visualization window

        this.startLine = mouseX;     //  assign graphics lines to mouse coordinates
        this.endLine = mouseX + (this.vizWidth * this.offsetPercent);

        if (this.endLine > this.right) {  //  range control
            this.endLine = this.right;
        }
        if (this.startLine < this.left) { //  range control
            this.startLine = this.left;
        }
        if (this.startLine > (this.right - this.offsetPercentInPixels)) {  //  range control
            this.startLine = this.right - this.offsetPercentInPixels;
        }   
    }
        //  draw slice lines on visualizer
        drawLines() {
        stroke(this.lineColor);
        line(this.startLine, this.top, this.startLine, this.bottom); //  start line
        line(this.endLine, this.top, this.endLine, this.bottom);   //  end line
    }

    //  here is the loop that adjusts the Tone.js Player object's start() method. Somehow, the playLoop's interval being adjusted kicks
    //  in the player object's fadeOut. No idea how this works. This solution was a total accident. Adding stop() to the playLoop
    //  or having the start() function get a duration parameter resulted in no fade out about 50% of the time
    playSlice(time) {       
        this.player.start(0, this.loopStartPoint);

        this.slice.interval = this.loopLength;
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
        oscilloBinsAmt,    //  number of bins for waveform analysis, needs to be a power of 2 
        fftBinsAmt,     //  number of frequency bins for fft analysis, needs to be a power of 2
        squareWindow      //  boolean to determine if window is a rectangle or square (square primarily for playback rate program)
    ) {
        this.Xpos = Xpos;
        this.Ypos = Ypos;
        this.scopeWd = scopeWd;
        this.scopeHt = scopeHt;
        this.oscilloBinsAmt = oscilloBinsAmt;
        this.fftBinsAmt = fftBinsAmt;
        this.squareWindow = squareWindow;

        this.wave = new Tone.Waveform();    //  set up new Tone Waveform object to do the analysis
        this.wave.size = this.oscilloBinsAmt;      //  amount of definition in the wave

        this.fft = new Tone.FFT();
        this.fft.size = this.fftBinsAmt;
        this.fftActive = false;
    }

    switchToFFT() {
        this.fftActive = this.fftActive ? this.fftActive = false : this.fftActive = true;
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

        if (!this.fftActive) {
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

        else {
            let buffer = this.fft.getValue();

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

                if (buffer[i] < -155) {
                    buffer[i] = -155;
                }

                let y = map(buffer[i], -155, 0, (this.Ypos + (0.5 * this.scopeHt)), (this.Ypos - (0.5 * this.scopeHt)));

                if (y < this.Ypos - (0.5 * this.scopeHt)) {
                    y = this.Ypos - (0.5 * this.scopeHt);
                }

                vertex(x,y);    //  assign to point in custom vertex shape
            }
            endShape();     //  finish custom vertex shape
        }
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

//===================================================================================================================================================//
//===================================================================================================================================================//

class PlaygroundControls {
    constructor (
        parentXpos,     //  parent button x-axis position
        parentYpos,     //  parent button y-axis position
        parentButWd,    //  parent button width
        parentButHt,     //  parent button height 
        player     //  parent player object
    ) {
        this.parentXpos = parentXpos;
        this.parentYpos = parentYpos;
        this.parentButWd = parentButWd;
        this.parentButHt = parentButHt;
        this.player = player;

        this.delayActive = false;
        this.delayButton = createButton('DELAY');
        this.delayButton.position(0.9 * parentXpos, parentYpos);
        this.delayButton.size(0.5 * parentButWd, parentButHt);
        this.delayButton.mousePressed(() => {this.triggerDelay()});
        this.delaySignal = new SignalCircle((0.9 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);

        this.delay = new Tone.FeedbackDelay({
            delayTime: 0.2,
            feedback: 0.7,
            wet: 0
        });
        this.delayTimeLFO = new Tone.LFO(0.02, 0.05, 0.3).start().connect(this.delay.delayTime);

        this.ampModActive = false;
        this.ampModButton = createButton('AMP MOD');
        this.ampModButton.position(0.8 * parentXpos, parentYpos);
        this.ampModButton.size(0.5 * parentButWd, parentButHt);
        this.ampModButton.mousePressed(() => {this.triggerAmpMod()});
        this.ampModSignal = new SignalCircle((0.8 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);

        this.ampModLFO = new Tone.LFO(15, -100, 0).connect(this.player.volume);
        this.ampModLFO.set({
            amplitude: 0,
            phase: 90
        });
        this.ampModLFOModulator = new Tone.LFO(0.1, 0.4, 40).start().connect(this.ampModLFO.frequency);

        this.filterSweepActive = false;
        this.filterSweepButton = createButton('FILTER SWEEP');
        this.filterSweepButton.position(0.7 * parentXpos, parentYpos);
        this.filterSweepButton.size(0.5 * parentButWd, parentButHt);
        this.filterSweepButton.mousePressed(() => {this.triggerFilterSweep()});
        this.filterSweepSignal = new SignalCircle((0.7 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);

        this.filterSweep = new Tone.AutoFilter({
            frequency: 2,
            baseFrequency: 100,
            depth: 1.0,
            octaves: 4
        });
        this.filterSweep.filter.Q.value = 10;

        this.freqShifterActive = false;
        this.freqShifterButton = createButton('FREQ SHIFT');
        this.freqShifterButton.position(0.6 * parentXpos, parentYpos);
        this.freqShifterButton.size(0.5 * parentButWd, parentButHt);
        this.freqShifterButton.mousePressed(() => {this.triggerFreqShifter()});
        this.freqShifterSignal = new SignalCircle((0.6 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);

        this.freqShifter = new Tone.FrequencyShifter({
            frequency: 0
        });
        this.freqShifterLFO = new Tone.LFO(0.5, -300, 200).connect(this.freqShifter.frequency);
        this.freqShifterLFO.set({
            phase: 90,
            wet: 0
        });

        this.reverbActive = false;
        this.reverbButton = createButton('REVERB');
        this.reverbButton.position(0.5 * parentXpos, parentYpos);
        this.reverbButton.size(0.5 * parentButWd, parentButHt);
        this.reverbButton.mousePressed(() => {this.triggerReverb()});
        this.reverbSignal = new SignalCircle((0.5 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);

        this.reverb = new Tone.Reverb();
        this.reverb.set({
            decay: 3.0,
            wet: 0
        });

        this.playbackRateLoop = new Tone.Loop((time) => this.playbackRateLFO(), 0.05);
        this.playbackRateActive = false;
        this.playbackRateGoingDown = true;
        this.playbackRateButton = createButton('PLAYBACK RATE');
        this.playbackRateButton.position(0.4 * parentXpos, parentYpos);
        this.playbackRateButton.size(0.5 * parentButWd, parentButHt);
        this.playbackRateButton.mousePressed(() => {this.triggerPlaybackRateLoop();});
        this.playbackRateSignal = new SignalCircle((0.4 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt)

        this.reverseActive = false;
        this.reverseButton = createButton('REVERSE');
        this.reverseButton.position(0.3 * parentXpos, parentYpos);
        this.reverseButton.size(0.5 * parentButWd, parentButHt);
        this.reverseButton.mousePressed(() => {this.triggerReverse();});
        this.reverseSignal = new SignalCircle((0.3 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt)
    }

    connectToBus(_output, _reverbOut) {
        this.delay.connect(_output);
        this.filterSweep.connect(_output);
        this.freqShifter.connect(_output);
        this.reverb.connect(_reverbOut);
    }

    setParameters() {

    }

    checkForActivity() {
        if (this.delayActive) {this.delaySignal.drawActiveCircle();}
        if (this.ampModActive) {this.ampModSignal.drawActiveCircle();}
        if (this.filterSweepActive) {this.filterSweepSignal.drawActiveCircle();}
        if (this.freqShifterActive) {this.freqShifterSignal.drawActiveCircle();}
        if (this.reverbActive) {this.reverbSignal.drawActiveCircle();}
        if (this.playbackRateActive) {this.playbackRateSignal.drawActiveCircle();}
        if (this.reverseActive) {this.reverseSignal.drawActiveCircle();}
    }
    
    triggerDelay() {
        //  flip delay on/off
        this.delayActive = this.delayActive ? this.delayActive = false : this.delayActive = true;
        
        if (this.delayActive) {
            this.player.connect(this.delay);
            this.delay.wet.rampTo(1, 0.1);
        }

        else {
            this.delay.wet.rampTo(0, 0.1);
            this.player.disconnect(this.delay);
        }
    }

    triggerAmpMod() {
        // flip amp mod on/off
        this.ampModActive = this.ampModActive ? this.ampModActive = false : this.ampModActive = true;

        if (this.ampModActive) {
            this.player.volume.rampTo(-100, 0.1);
            this.ampModLFO.amplitude.rampTo(1, 0.1);
            this.ampModLFO.start("+0.1");
        }

        else {
            this.ampModLFO.amplitude.rampTo(0, 0.1);
            this.player.volume.rampTo(0, 0.1);
            this.ampModLFO.stop("+0.1");
        }
    }

    triggerFilterSweep() {
        this.filterSweepActive = this.filterSweepActive ? this.filterSweepActive = false : this.filterSweepActive = true;

        if (this.filterSweepActive) {
            this.player.connect(this.filterSweep);
            this.filterSweep.start();
        }

        else {
            this.player.disconnect(this.filterSweep);
            this.filterSweep.stop();
        }
    }

    triggerFreqShifter() {
        this.freqShifterActive = this.freqShifterActive ? this.freqShifterActive = false : this.freqShifterActive = true;

        if (this.freqShifterActive) {
            this.player.connect(this.freqShifter);
            this.freqShifter.wet.rampTo(1, 0.1);
            this.freqShifterLFO.start();
        }

        else {
            this.freqShifter.wet.rampTo(0, 0.1);
            this.player.disconnect(this.freqShifter);
        }
    }

    triggerReverb() {
        this.reverbActive = this.reverbActive ? this.reverbActive = false : this.reverbActive = true;

        if (this.reverbActive) {
            this.player.connect(this.reverb);
            this.reverb.wet.rampTo(1, 0.1);

        }

        else {
            this.reverb.wet.rampTo(0, 10);
            this.player.disconnect(this.reverb);
        }
    }

    triggerPlaybackRateLoop() {
        this.playbackRateActive = this.playbackRateActive ? this.playbackRateActive = false : this.playbackRateActive = true;

        if (this.playbackRateActive) {
            this.playbackRateLoop.start();
        }
        else {
            this.playbackRateLoop.stop();
            this.playbackRateToNormal = new Tone.Loop(((time) => {
                if (this.player.playbackRate < 1) {
                    this.player.playbackRate += 0.01
                }
                else if (this.player.playbackRate > 1) {
                    this.player.playbackRate -= 0.01
                }
                if (this.player.playbackRate == 1) {
                    this.playbackRateToNormal.stop();
                }
            }), 0.02).start();

        }
    }

    playbackRateLFO() {
        let curRate = this.player.playbackRate;
        
        if (this.playbackRateGoingDown) {
            this.player.playbackRate -= 0.01;
        }
        else {
            this.player.playbackRate += 0.01;
        }

        if (curRate < 0.05) {
            this.playbackRateGoingDown = false;
        }        
        else if (curRate > 2) {
            this.playbackRateGoingDown = true;
        }
    }

    triggerReverse() {
        this.reverseActive = this.reverseActive ? this.reverseActive = false : this.reverseActive = true;

        if (this.reverseActive) {
            this.reverseLoop = new Tone.Loop((time) => {
                if (this.player.playbackRate > 0.02 && !this.player.reverse) {
                    this.player.playbackRate -= 0.01
                }

                if (this.player.playbackRate <= 0.02 && !this.player.reverse) {
                    this.player.volume.rampTo(-100, 0.05);
                    setTimeout(this.player.reverse = true, 100);
                    this.player.volume.rampTo(0, 0.5);
                }

                if (this.player.playbackRate < 1 && this.player.reverse) {
                    this.player.playbackRate += 0.01;
                }

                if (this.player.playbackRate == 1 && this.player.reverse) {
                    this.reverseLoop.stop();
                }
            }, 0.01).start();
        }

        else {
            this.reverseLoop = new Tone.Loop((time) => {
                if (this.player.playbackRate > 0.02 && this.player.reverse) {
                    this.player.playbackRate -= 0.01
                }

                if (this.player.playbackRate <= 0.02 && this.player.reverse) {
                    this.player.volume.rampTo(-100, 0.05);
                    setTimeout(this.player.reverse = false, 100);
                    this.player.volume.rampTo(0, 0.5);
                }

                if (this.player.playbackRate < 1 && !this.player.reverse) {
                    this.player.playbackRate += 0.01;
                }

                if (this.player.playbackRate == 1 && !this.player.reverse) {
                    this.reverseLoop.stop();
                }
            }, 0.01).start();
        }
    }
}


//===================================================================================================================================================//
//===================================================================================================================================================//


/**
 * Draws a blue or red circle if an effect is active or not
 */

 class SignalCircle {
    constructor(
        x_coordinate,
        y_coordinate,
        radius
    ) {
        this.x_coordinate = x_coordinate;
        this.y_coordinate = y_coordinate;
        this.radius = radius;
    }

    drawActiveCircle() {    //  if the effect is active
        fill(0, 0, 255);    //  green

        circle(this.x_coordinate, this.y_coordinate, this.radius);  //  draw circle
    }

    drawInactiveCircle() {    //  if the effect is active
        fill(255, 0, 0);    //  green

        circle(this.x_coordinate, this.y_coordinate, this.radius);  //  draw circle
    }
}