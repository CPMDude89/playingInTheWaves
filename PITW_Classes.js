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
            fadeIn: 0.1,
            fadeOut: 0.1,
            loop: true
        }); //  Tone player object to handle playback
        
        this.state = 'ready';   //  string to keep track of recording process and playback
        this.sampleLoaded = false;

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

            setTimeout(() => {
                let array = this.player.buffer.getChannelData(0);
                let max = 10000;
                
                for (let i = 0; i < max; i++) {
                    array[i] = array[i] * (i/max);
                    this.player.buffer.getChannelData(0)[this.player.buffer.getChannelData(0).length - (1 + i)] = this.player.buffer.getChannelData(0)[this.player.buffer.getChannelData(0).length - (1 + i)] * (i / max);
                }

                array = this.player.buffer.getChannelData(1);

                for (let i = 0; i < max; i++) {
                    array[i] = array[i] * (i/max);
                    this.player.buffer.getChannelData(1)[this.player.buffer.getChannelData(1).length - (1 + i)] = this.player.buffer.getChannelData(1)[this.player.buffer.getChannelData(1).length - (1 + i)] * (i / max);
                }
            }, 300);

            this.button.html('PLAY RECORDING');     //  change button text
            this.showControls();    //  send to function to show start over button
            this.sampleLoaded = false;
            this.state = 'play';    //  change string to keep track of process
        }

        else if (this.state == 'play') {    //  play recorded audio buffer
            this.button.html('STOP PLAYBACK');  //  change button text
            this.state = 'stop';    //  change string to keep track of process

            this.player.start();
        }

        else if (this.state = 'stop') {
            if (this.sampleLoaded) {
                this.button.html('PLAY SAMPLE');
            }
            else {
                this.button.html('PLAY RECORDING');     //  change button text
            }
            
            this.state = 'play';    //  change string to keep track of process

            this.player.stop();     //  stop player
        }
    }

    showControls() {
        this.button.size(this.butWd * 0.65, this.butHt);
        this.button.position(this.Xpos + (0.35 * this.butWd), this.Ypos);
        this.clearButton = createButton('START OVER');  //  create button to restart process
        this.clearButton.position(this.Xpos, this.Ypos);   
        this.clearButton.size(0.35 * this.butWd, this.butHt);
        this.clearButton.mousePressed(() => {
            this.button.size(this.butWd, this.butHt);
            this.button.position(this.Xpos, this.Ypos);
            this.button.html('RECORD');
            this.player.stop();
            this.state = 'ready';
            this.clearButton.remove();
        })
    }
    
    /*
    playLoop(time) {
        
        if (this.player.state == "stopped" && this.player.playbackRate == 1) {
            this.player.start();
        }

        else if (this.player.state == "stopped" && this.player.playbackRate != 1) {
            //this.loop.interval = this.player.buffer.duration * (1 + (1 - this.player.playbackRate));
            this.player.start(0, 0);
            this.loop.interval = this.timeStretchedInterval;
        }

       console.log("interval: " + this.loop.interval + " duration: " + this.player.buffer.duration + " playrate: " + this.player.playbackRate);

        //this.loop.interval = this.player.buffer.duration * (1 + (1 - this.player.playbackRate));
    }
    */
    
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
            loop: true,
            volume: 0
        });
        this.playerBackward = new Tone.Player({ //  create backwards running player
            fadeIn: 0.2,
            fadeOut: 0.2,
            reverse: true,
            loop: true,
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

            setTimeout(() => {
                let arrayForward = this.playerForward.buffer.getChannelData(0);
                let arrayBackward = this.playerBackward.buffer.getChannelData(0);
                let max = 8000;
                
                for (let i = 0; i < max; i++) {
                    arrayForward[i] = arrayForward[i] * (i/max);
                    arrayBackward[i] = arrayBackward[i] * (i/max);
                    this.playerForward.buffer.getChannelData(0)[this.playerForward.buffer.getChannelData(0).length - (1 + i)] = this.playerForward.buffer.getChannelData(0)[this.playerForward.buffer.getChannelData(0).length - (1 + i)] * (i / max);
                    this.playerBackward.buffer.getChannelData(0)[this.playerBackward.buffer.getChannelData(0).length - (1 + i)] = this.playerBackward.buffer.getChannelData(0)[this.playerBackward.buffer.getChannelData(0).length - (1 + i)] * (i / max);
                }

                arrayForward = this.playerForward.buffer.getChannelData(1);
                arrayBackward = this.playerBackward.buffer.getChannelData(1);

                for (let i = 0; i < max; i++) {
                    arrayForward[i] = arrayForward[i] * (i/max);
                    arrayBackward[i] = arrayBackward[i] * (i/max);
                    this.playerForward.buffer.getChannelData(1)[this.playerForward.buffer.getChannelData(1).length - (1 + i)] = this.playerForward.buffer.getChannelData(1)[this.playerForward.buffer.getChannelData(1).length - (1 + i)] * (i / max);
                    this.playerBackward.buffer.getChannelData(1)[this.playerBackward.buffer.getChannelData(1).length - (1 + i)] = this.playerBackward.buffer.getChannelData(1)[this.playerBackward.buffer.getChannelData(1).length - (1 + i)] * (i / max);
                }
            }, 300);

            this.button.html('PLAY RECORDING');     //  change button text
            this.showControls();    //  send to function to show start over button
            this.state = 'play';    //  change string to keep track of process
        }

        else if (this.state == 'play') {    //  play recorded audio buffer
            this.button.html('STOP PLAYBACK');  //  change button text
            this.state = 'stop';    //  change string to keep track of process
            
            this.playerForward.start();     //  stop player
            this.playerBackward.start();     //  stop player

        }

        else if (this.state = 'stop') {
            this.button.html('PLAY RECORDING');     //  change button text
            this.state = 'play';    //  change string to keep track of process

            this.playerForward.stop();     //  stop player
            this.playerBackward.stop();     //  stop player
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

       this.player = new Tone.Player({
           loop: true
       });
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

        console.log(this.loopStartPoint);
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
        player,     //  parent player object
        volOut,     //  parent player volume node
        verb,   //  parent script reverb node
        filterSweepFreq     //  Auto Filter Frequency. This is needed for easy control when using Param Track
    ) {
        this.parentXpos = parentXpos;
        this.parentYpos = parentYpos;
        this.parentButWd = parentButWd;
        this.parentButHt = parentButHt;
        this.player = player;
        this.volOut = volOut;
        this.verb = verb;
        this.filterSweepFreq = filterSweepFreq;

        this.playerSignal = new SignalCircle(this.parentXpos + 0.65 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);

        this.paramTrackActive = false;

        this.delayActive = false;
        this.delayParamTrackActive = false;
        this.delayParamTrackActive_Y = false;
        this.delayButton = createButton('DELAY');
        this.delayButton.position(0.9 * parentXpos, parentYpos);
        this.delayButton.size(0.5 * parentButWd, parentButHt);
        this.delayButton.mousePressed(() => this.triggerDelay());
        this.delaySignal = new SignalCircle((0.9 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);

        this.delay = new Tone.FeedbackDelay({
            delayTime: 0.2,
            feedback: 0.7,
            wet: 0
        });
        this.delayTimeLFO = new Tone.LFO(0.03, 0.05, 0.3).start().connect(this.delay.delayTime);

        this.ampModActive = false;
        this.ampModParamTrackActive = false;
        this.ampModParamTrackActive_Y = false;
        this.ampModButton = createButton('AMP MOD');
        this.ampModButton.position(0.8 * parentXpos, parentYpos);
        this.ampModButton.size(0.5 * parentButWd, parentButHt);
        this.ampModButton.mousePressed(() => this.triggerAmpMod());
        this.ampModSignal = new SignalCircle((0.8 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);

        this.ampModLFO = new Tone.LFO(1, -100, 0).connect(this.player.volume);
        this.ampModLFO.set({
            amplitude: 0,
            phase: 90
        });
        this.ampModLFOModulator = new Tone.LFO(0.1, 0.4, 40).start().connect(this.ampModLFO.frequency);

        this.ampModLFOParamTrack = new Tone.LFO(1, -100, 0).connect(this.player.volume);
        this.ampModLFOParamTrack.set({
            amplitude: 0,
            phase: 90
        });

        this.filterSweepActive = false;
        this.filterSweepParamTrackActive = false;
        this.filterSweepParamTrackActive_Y = false;
        this.filterSweepButton = createButton('FILTER SWEEP');
        this.filterSweepButton.position(0.7 * parentXpos, parentYpos);
        this.filterSweepButton.size(0.5 * parentButWd, parentButHt);
        this.filterSweepButton.mousePressed(() => this.triggerFilterSweep());
        this.filterSweepSignal = new SignalCircle((0.7 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);

        this.filterSweep = new Tone.AutoFilter({
            frequency: this.filterSweepFreq,
            baseFrequency: 100,
            depth: 0.8,
            octaves: 4
        });
        this.filterSweep.filter.Q.value = 6;

        this.freqShifterActive = false;
        this.freqShifterParamTrackActive = false;
        this.freqShifterParamTrackActive_Y = false;
        this.freqShifterButton = createButton('FREQ SHIFT');
        this.freqShifterButton.position(0.6 * parentXpos, parentYpos);
        this.freqShifterButton.size(0.5 * parentButWd, parentButHt);
        this.freqShifterButton.mousePressed(() => this.triggerFreqShifter());
        this.freqShifterSignal = new SignalCircle((0.6 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);

        this.freqShifter = new Tone.FrequencyShifter({
            frequency: 0
        });

        this.freqShifterLFO = new Tone.LFO(0.5, -300, 200).connect(this.freqShifter.frequency);
        this.freqShifterLFO.set({
            phase: 90,
            wet: 0
        });

        this.freqShifterParamTrack = new Tone.FrequencyShifter({
            frequency: 100,
            wet: 0
        });
        this.player.connect(this.freqShifterParamTrack);

        this.playbackRateIncrement = 0.01;
        //this.playbackRateLoop = new Tone.Loop((time) => this.playbackRateLFO(), 0.05);
        this.playbackRateActive = false;
        this.playbackRateParamTrackActive = false;
        this.playbackRateParamTrackActive_Y = false;
        this.playbackRateGoingDown = true;
        this.playbackRateButton = createButton('PLAYBACK RATE');
        this.playbackRateButton.position(0.5 * parentXpos, parentYpos);
        this.playbackRateButton.size(0.5 * parentButWd, parentButHt);
        this.playbackRateButton.mousePressed(() => this.triggerPlaybackRateLoop());
        this.playbackRateSignal = new SignalCircle((0.5 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt)

        this.reverseActive = false;
        this.reverseButton = createButton('REVERSE');
        this.reverseButton.position(0.4 * parentXpos, parentYpos);
        this.reverseButton.size(0.5 * parentButWd, parentButHt);
        this.reverseButton.mousePressed(() => this.triggerReverse());
        this.reverseSignal = new SignalCircle((0.4 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt)

        this.pannerActive = false;
        this.pannerParamTrackActive = false;
        this.pannerParamTrackActive_Y = false;
        this.pannerButton = createButton('PANNER');
        this.pannerButton.position(0.3 * parentXpos, parentYpos);
        this.pannerButton.size(0.5 * parentButWd, parentButHt);
        this.pannerButton.mousePressed(() => this.triggerPanner());
        this.pannerSignal = new SignalCircle((0.3 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);

        this.panner = new Tone.AutoPanner({
            frequency: 3,
            depth: 0.7
        });

        this.pannerFreqLFO = new Tone.LFO(0.3, 1, 8).connect(this.panner.frequency);

        this.pannerParamTrack = new Tone.AutoPanner({
            frequency: 1,
            depth: 1
        });

        this.reverbActive = false;
        this.reverbButton = createButton('REVERB');
        this.reverbButton.position(0.2 * parentXpos, parentYpos);
        this.reverbButton.size(0.5 * parentButWd, parentButHt);
        this.reverbButton.mousePressed(() => this.triggerReverb());
        this.reverbSignal = new SignalCircle((0.2 * this.parentXpos) + 0.25 * this.parentButWd, this.parentYpos - (0.5 * parentButHt), 0.5 * parentButHt);
    }

    connectToBus(_output) {
        this.delay.connect(_output);
        this.filterSweep.connect(_output);
        this.freqShifter.connect(_output);
        this.freqShifterParamTrack.connect(_output);
        this.panner.connect(_output);
        this.pannerParamTrack.connect(_output);
    }

    checkForActivity() {
        if (this.player.state == 'started') {this.playerSignal.drawActiveCircle();}

        if (this.delayParamTrackActive) {
            if (!this.delayParamTrackActive_Y) {
                var dt = map(mouseX, 0, w, 1, 0.005);
                this.delay.delayTime.rampTo(dt, 0.3);
                this.delaySignal.drawLavenderCircle();
            }
            else {
                var dt = map(mouseY, h, 0, 1, 0.005);
                this.delay.delayTime.rampTo(dt, 0.3);
                this.delaySignal.drawGoldCircle();
            }
        }
        else if (!this.delayParamTrackActive && this.delayActive) {this.delaySignal.drawActiveCircle();}

        if (this.ampModParamTrackActive) {
            if (!this.ampModParamTrackActive_Y) {
                var am = map(mouseX, 0, w, 1, 200);
                this.ampModLFOParamTrack.frequency.rampTo(am, 0.1);
                this.ampModSignal.drawLavenderCircle();
            }
            else {
                var am = map(mouseY, h, 0, 1, 200);
                this.ampModLFOParamTrack.frequency.rampTo(am, 0.1);
                this.ampModSignal.drawGoldCircle();
            }
        }
        else if (!this.ampModParamTrackActive && this.ampModActive) {this.ampModSignal.drawActiveCircle();}

        if (this.filterSweepParamTrackActive) {
            if (!this.filterSweepParamTrackActive_Y) {
                var fs = map(mouseX, 0, w, 0.5, 30);
                this.filterSweep.frequency.rampTo(fs, 0.1);
                this.filterSweepSignal.drawLavenderCircle();
            }
            else {
                var fs = map(mouseY, h, 0, 0.5, 30);
                this.filterSweep.frequency.rampTo(fs, 0.1);
                this.filterSweepSignal.drawGoldCircle();
            }
        }
        else if (!this.filterSweepParamTrackActive && this.filterSweepActive) {this.filterSweepSignal.drawActiveCircle();}

        if (this.freqShifterParamTrackActive) {
            if (!this.freqShifterParamTrackActive_Y) {
                var frs = map(mouseX, 0, w, 0, 500);
                this.freqShifterParamTrack.frequency.rampTo(frs, 0.1);
                this.freqShifterSignal.drawLavenderCircle();
            }
            else {
                var frs = map(mouseY, h, 0, 0, 500);
                this.freqShifterParamTrack.frequency.rampTo(frs, 0.1);
                this.freqShifterSignal.drawGoldCircle();
            }
        }
        else if (!this.freqShifterParamTrackActive && this.freqShifterActive) {this.freqShifterSignal.drawActiveCircle();}

        if (this.playbackRateParamTrackActive) {
            if (!this.playbackRateParamTrackActive_Y) {
                var pr = map(mouseX, 0, w, 0.0001, 0.05);
                this.playbackRateIncrement = pr;
                this.playbackRateSignal.drawLavenderCircle();
            }
            else {
                var pr = map(mouseY, h, 0, 0.0001, 0.05);
                this.playbackRateIncrement = pr;
                this.playbackRateSignal.drawGoldCircle();
            }
        }
        else if (!this.playbackRateParamTrackActive && this.playbackRateActive) {this.playbackRateSignal.drawActiveCircle();}

        if (this.pannerParamTrackActive) {
            if (!this.pannerParamTrackActive_Y) {
                var ap = map(mouseX, 0, w, 1, 40);
                this.pannerParamTrack.frequency.rampTo(ap, 0.2);
                this.pannerSignal.drawLavenderCircle();
            }
            else {
                var ap = map(mouseY, h, 0, 1, 40);
                this.pannerParamTrack.frequency.rampTo(ap, 0.2);
                this.pannerSignal.drawGoldCircle();
            }
        }
        else if (!this.pannerParamTrackActive && this.pannerActive) {this.pannerSignal.drawActiveCircle();}
        
        if (this.reverbActive) {this.reverbSignal.drawActiveCircle();}
        if (this.reverseActive) {this.reverseSignal.drawActiveCircle();}
    }

    checkParamTracks() {
        var check = 0;

        if (this.delayParamTrackActive) {check++;}
        if (this.ampModParamTrackActive) {check++;}

        if (check > 0) {this.paramTrackActive = true;}
        else {this.paramTrackActive = false;}

        //console.log(this.paramTrackActive);
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

            this.delayTimeLFO.start();
            this.delayParamTrackActive = false;
            this.delayParamTrackActive_Y = false;

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
            this.ampModLFOParamTrack.stop();
            this.ampModLFOParamTrack.phase = 90;
            this.ampModParamTrackActive = false;
            this.ampModParamTrackActive_Y = false;
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

            this.filterSweepParamTrackActive = false;
            this.filterSweepParamTrackActive_Y = false;
            this.filterSweep.frequency.value = this.filterSweepFreq;

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
            this.freqShifterParamTrack.wet.rampTo(0, 0.1);
            this.freqShifterParamTrackActive = false;
            this.freqShifterParamTrackActive_Y = false;
        }
    }

    triggerPlaybackRateLoop() {
        this.playbackRateActive = this.playbackRateActive ? this.playbackRateActive = false : this.playbackRateActive = true;

        if (this.playbackRateActive) {
            this.playbackRateLoop = new Tone.Loop((time) => this.playbackRateLFO(), 0.05);
            this.playbackRateLoop.start();
        }
        else {
            this.playbackRateLoop.stop();
            /*
            this.playbackRateToNormal = new Tone.Loop(((time) => {
                if (this.player.playbackRate < 1) {
                    this.player.playbackRate += 0.01
                }
                else if (this.player.playbackRate > 1) {
                    this.player.playbackRate -= 0.01
                }
                if (this.player.playbackRate < 1.0001 && this.player.playbackRate > 99.999) {
                    this.playbackRateToNormal.stop();
                }
            }), 0.02).start();
            */

            this.playbackRateLoop.stop();
            this.playbackRateParamTrackActive = false;
            this.playbackRateParamTrackActive_Y = false;
            this.playbackRateGoingDown = true;

            Tone.Transport.schedule((time) => {
                //this.playbackRateToNormal.stop();
                this.player.playbackRate = 1;
            })
        }
    }

    playbackRateLFO() {
        var curRate = this.player.playbackRate;
        
        if (this.playbackRateGoingDown) {
            //this.player.playbackRate -= 0.01;
            this.player.playbackRate -= this.playbackRateIncrement;
        }
        else {
            //this.player.playbackRate += 0.01;
            this.player.playbackRate += this.playbackRateIncrement;
        }

        if (curRate < 0.18) {
            this.playbackRateGoingDown = false;
        }        
        else if (curRate > 1.6) {
            this.playbackRateGoingDown = true;
        }
    }

    triggerReverse() {
        this.reverseActive = this.reverseActive ? this.reverseActive = false : this.reverseActive = true;
        if (this.playbackRateActive) {
            this.playbackRateActive = false;
        }

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

    triggerPanner() {
        this.pannerActive = this.pannerActive ? this.pannerActive = false : this.pannerActive = true;

        if (this.pannerActive) {
            this.pannerFreqLFO.start();
            this.panner.start();
            this.player.connect(this.panner);
        }

        else {
            this.pannerFreqLFO.stop();
            this.panner.wet.rampTo(1, 0.1);
            //this.player.disconnect(this.panner);
            this.panner.stop();
            
            this.pannerParamTrackActive = false;
            this.pannerParamTrack.wet.rampTo(0, 0.1);
            this.pannerParamTrack.stop();
            //this.player.disconnect(this.pannerParamTrack);
            this.pannerParamTrackActive = false;
            this.pannerParamTrackActive_Y = false;
        }
    }

    triggerReverb() {
        this.reverbActive = this.reverbActive ? this.reverbActive = false : this.reverbActive = true;

        if (this.reverbActive) {
            this.player.connect(this.verb);
        }

        else {
            this.player.disconnect(this.verb);
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
        diameter
    ) {
        this.x_coordinate = x_coordinate;
        this.y_coordinate = y_coordinate;
        this.diameter = diameter;
    }

    drawActiveCircle() {    //  if the effect is active
        fill(0, 0, 255);    //  green

        circle(this.x_coordinate, this.y_coordinate, this.diameter);  //  draw circle
    }

    drawInactiveCircle() {    //  if the effect is inactive
        fill(200, 0, 0);    //  red

        circle(this.x_coordinate, this.y_coordinate, this.diameter);  //  draw circle
    }    

    drawRecordingCircle() {    //  if recording
        fill(255, 0, 0);    //  red

        circle(this.x_coordinate, this.y_coordinate, this.diameter);  //  draw circle
    }

    drawLavenderCircle() {    //  if the effect is active
        fill(189, 127, 220);    //  lavender

        circle(this.x_coordinate, this.y_coordinate, this.diameter);  //  draw circle
    }

    drawGoldCircle() {    //  if the effect is active
        fill(214, 214, 31);    //  gold

        circle(this.x_coordinate, this.y_coordinate, this.diameter);  //  draw circle
    }

 
}
