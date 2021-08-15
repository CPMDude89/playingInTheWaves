/**
 * File containing all p5.sound-specific custom classes designed for the 'Playing In The Waves' project
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
 */

/**
 * Class template for a single looper object
 * Will take in user recorderings, and run them through effects
 * This class will create the buttons to do all this, takes in coordinates as constructor arguments where the buttons go
 */
 class Looper {
    constructor(
        //  get variable input from user
        buttonX,    //  button x-coordinate
        buttonY,    //  button y-coordinate
        buttonWidth,    //  button width
        buttonHeight,    //  button height
        effButX,     //  effect button x-coordinate
        mic     //  single input source
    ) {
        //  define properties
        this.buttonX = buttonX; //  apply user input to class-instance variables
        this.buttonY = buttonY;
        this.buttonWidth = buttonWidth;
        this.buttonHeight = buttonHeight;
        this.effButX = effButX;
        this.effButWidth = 1.4 * this.buttonWidth;
        this.effButHeight = 0.3 * this.buttonHeight;
        this.effButY = this.buttonY - this.effButHeight;

        this.mic = mic;    //  user input source (computer mic)
        this.recorder = new p5.SoundRecorder(); //  p5 sound recorder object
        this.soundFile = new p5.SoundFile();    //  p5 SoundFile object for audio buffer
        this.state = 0; //  'state' variable used to control button functions through recording -> playback
        this.delay = new p5.Delay();
        this.reverbFor = new p5.Reverb();
        this.reverbBack = new p5.Reverb();
        this.ampModOsc = new p5.Oscillator();
        this.ampModOsc.start();
        this.ampModOsc.disconnect();
        this.ampModOsc.scale(-1, 1, 0, 1);

        this.button = createButton('START RECORD'); //  create button
        this.button.mousePressed(() => this.record());  //  when button is clicked, start record process

        this.clearButton;
        this.delayButton;
        this.delayActive = false;
        this.reverbButton;
        this.reverbActive = false;
        this.ampModButton;
        this.ampModActive = false;

        this.buttons;
    }

    //  set everything up
    init(_buttons) {
        this.mic.start();   //  set up input source
        this.recorder.setInput(this.mic);   //  connect microphone to recorder object

        this.button.position(this.buttonX, this.buttonY);   //  set up main button
        this.button.size(this.buttonWidth, this.buttonHeight);

        this.buttons = _buttons;    //  connect this looper instance with it's own buttons instance

        this.reverbBack.set(3, 2, true);
    }
    
    // -------- GETTERS -------- //
    getbigButYDimensions() {    //  get the y dimensions of the record/play button to narrow down the mousePressed()
        return [this.buttonY, (this.buttonY + this.buttonHeight)];
    }

    getState() {
        return this.state;
    }
    
    getEffButX() {
        return this.effButX;
    }

    getEffButY() {
        return this.effButY;
    }

    getEffButWidth() {
        return this.effButWidth;
    }

    getEffButHeight() {
        return this.effButHeight;
    }


    //  use rec button to record voice and play back 
    record() {
        userStartAudio();   //  ensure audio is good to go

        if (this.state == 0 && this.mic.enabled) {    //  if nothing has been recorded yet and input is OK
        //  record into p5.SoundFile after 120 milliseconds to get past mouse click
        setTimeout(() => this.recorder.record(this.soundFile, 10), 120);
        
        this.button.html('STOP RECORDING')  //  change button text
        this.state++;   //  change state to move to play back
        }

        else if (this.state == 1) {    //  stop recorder and send result to soundFile
            this.recorder.stop();   //  stop recorder

            this.button.html('PLAY');   //  reassign button text
            this.state++;   //  increase state for record process
            this.button.size(this.buttonWidth/2, this.buttonHeight);    //  make room for new buttons

            this.addClearButton();  //  clear the buffer and start over
            this.addDelayButton();  //  apply delay
            this.addReverbButton(); //  apply reverb
            this.addAmpModButton(); //  apply amplitude modulation

            this.buttons.makeControlButtons();
        }

        else if (this.state == 2) { //  play back recording
            this.soundFile.loop();
            this.soundFile.jump(0);

            this.button.html('STOP');
            this.state++;
        }

        else if(this.state == 3) {  //  stop playback
            this.soundFile.stop();

            this.button.html('PLAY');
            this.state--;
        }
    }

    addClearButton() {  //  button to reset buffer
        this.clearButton = createButton('CLEAR');
        this.clearButton.position(this.buttonX + (this.buttonWidth/2), this.buttonY);
        this.clearButton.size(this.buttonWidth/2, this.buttonHeight);


        this.clearButton.mousePressed(() => {  //  clear audio buffer and reset buttons
            this.soundFile.stop();  //  stop audio file
            this.button.size(this.buttonWidth, this.buttonHeight);  //  re-size button to fill gap
            this.soundFile = new p5.SoundFile();    //  intantiate new soundFile object
            this.button.html('START RECORD');       
            this.state = 0; //  reset state to restart record process

            this.reverbButton.remove();     //  get rid of buttons
            this.ampModButton.remove();
            this.delayButton.remove();
            this.buttons.removeControlButtons();
            this.clearButton.remove();  
        });
    }

    addDelayButton() {  //  control delay output
        this.delayButton = createButton('ACTIVATE DELAY');    //  create delay button
        this.delayButton.position(this.effButX, this.effButY);
        this.delayButton.size(this.effButWidth, this.effButHeight);

        this.delayButton.mousePressed(() => {   //  trigger delay
            if (!this.delayActive) {    //  if delay is not active yet, make active
                this.delay.process(this.soundFile); //  connect delay to soundFile output
                this.delay.delayTime(0.55); //  delay time
                this.delay.feedback(0.65);   //  feedback amount
                this.delay.filter(2000);    //  lowpass filter (helpful with high feedback)
                this.delay.drywet(1);   //  full volume
                this.delay.setType('pingPong'); //  ping pong delay

                this.delayButton.html('DEACTIVATE DELAY'); //  change button text

                this.delayActive = true;    //  flip boolean
            }
            
            else {  //  if delay is triggered, turn off
                this.delay.drywet(0);   //  volume level: 0

                this.delayButton.html('ACTIVATE DELAY');  //  change button

                this.delayActive = false;   //  flip boolean
            }
        })
    }

    addReverbButton() {
        this.reverbButton = createButton('ACTIVATE REVERB');
        this.reverbButton.position(0.75 * this.effButX, this.effButY);
        this.reverbButton.size(this.effButWidth, this.effButHeight);

        this.reverbButton.mousePressed(() => {
            if (!this.reverbActive) {
                this.reverbFor.process(this.soundFile, 3, 2);
                this.reverbFor.drywet(1);

                this.reverbBack.process(this.soundFile, 3, 2, true);
                this.reverbBack.drywet(0);

                this.reverbButton.html('DEACTIVATE REVERB');

                this.reverbActive = true;
            }

            else {
                this.reverbFor.drywet(0);

                this.reverbButton.html('ACTIVATE REVERB');

                this.reverbActive = false;
            }
        })
    }

    addAmpModButton() { //  control amplitude modulation
        this.ampModButton = createButton('ACTIVATE AMP MOD');
        this.ampModButton.position(0.5 * this.effButX, this.effButY);
        this.ampModButton.size(this.effButWidth, this.effButHeight);
        
        

        this.ampModButton.mousePressed(() => {
            if (!this.ampModActive) {
                this.ampModOsc.start();
                //this.ampModOsc.freq(Math.round(random(20)));
                this.ampModOsc.freq(0.1);
                this.ampModOsc.amp(1);
                this.soundFile.setVolume(this.ampModOsc);
    
                this.ampModButton.html('DEACTIVATE AMP MOD');
                this.ampModActive = true;
            }
            
            else {
                this.ampModOsc.stop();
                this.soundFile.setVolume(0.5);
    
                this.ampModButton.html('ACTIVATE AMP MOD');
                this.ampModActive = false;
            }
        });
    }
}

//===================================================================================================================================================//
//===================================================================================================================================================//

/**
 * Using p5.createButtons object to make html objects in the DOM
 * Because using the draw loop was potentially taxing the host server too much
 * 
 * We'll see if this fixes the problem
 */

 class Buttons {
    constructor(
        parentButX,     //  parent effect button x-coordinate
        parentButY,    //  parent effect button y-coordinate
        parentButWidth,    //  parent effect button width
        parentButHeight, //    parent effect button height
        looper  //  this buttons instance's of looper
    ) {
        this.parentButX = parentButX;
        this.parentButY = parentButY;
        this.parentButWidth = parentButWidth;
        this.parentButHeight = parentButHeight;
        this.looper = looper;

        this.delayButX = parentButX;    //  keep track of specific effect button x-coordinates
        this.reverbButX = 0.75 * parentButX;
        this.ampModButX = 0.5 * parentButX;

        //  delay, reverb, amp mod signal circles
        this.delaySignal = new SignalCircle(1.01 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        this.reverbSignal = new SignalCircle(.76 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        this.ampModSignal = new SignalCircle(.51 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);

        this.delayRouteIntoReverbActive = false;
        this.routeDelToVerbSignal = new SignalCircle((0.15 * this.parentButWidth) + this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);
        
        this.delayTimeLFO = new p5.Oscillator();
        this.delayTimeLFOActive = false;
        this.delayTimeLFOSignal = new SignalCircle((0.15 * this.parentButWidth) + 1.075 * this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);

        this.delayFilterLFO = new p5.Oscillator();
        this.delayFilterLFOActive = false;        
        this.delayFilterLFOSignal = new SignalCircle((0.15 * this.parentButWidth) + 1.15 * this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);

        this.reverbBackwardsActive = false;
        this.reverbBackwardsSignal = new SignalCircle((0.15 * this.parentButWidth) + this.reverbButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);

        this.reverbLongTailActive = false;
        this.reverbLongTailSignal = new SignalCircle((0.15 * this.parentButWidth) + 1.1 * this.reverbButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);

        this.reverbAmpModActive = false;
        this.reverbAmpModSignal = new SignalCircle((0.15 * this.parentButWidth) + 1.2 * this.reverbButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);

        this.ampModFreqLFOActive = false;
    }

    init() {    //  set up functions and objects that can only be called once
        this.delayTimeLFO.start();
        this.delayTimeLFO.disconnect();
        this.delayTimeLFO.scale(-1, 1, 0, 1);

        this.delayFilterLFO.start();    //  start up LFO
        this.delayFilterLFO.disconnect();
        this.delayFilterLFO.scale(-1, 1, 10, 5000);
    }

    effButAlerts() {    //  draw signal circles to determine if effect is active: red == off, green == on
        //  delay
        this.looper.delayActive ? this.delaySignal.drawActiveCircle() : this.delaySignal.drawInactiveCircle();

        if (this.looper.delayActive) {
        // route delay to reverb
            this.delayRouteIntoReverbActive ? this.routeDelToVerbSignal.drawActiveCircle() : this.routeDelToVerbSignal.drawInactiveCircle();
        
            //  delay time LFO
            this.delayTimeLFOActive ? this.delayTimeLFOSignal.drawActiveCircle() : this.delayTimeLFOSignal.drawInactiveCircle();

            //  delay filter LFO
            this.delayFilterLFOActive ? this.delayFilterLFOSignal.drawActiveCircle() : this.delayFilterLFOSignal.drawInactiveCircle();
        }
        
        //  reverb
        this.looper.reverbActive ? this.reverbSignal.drawActiveCircle() : this.reverbSignal.drawInactiveCircle();
        
        if (this.looper.reverbActive) {
            //  reverse reverb
            this.reverbBackwardsActive ? this.reverbBackwardsSignal.drawActiveCircle() : this.reverbBackwardsSignal.drawInactiveCircle();

            //  reverb long tail
            this.reverbLongTailActive ? this.reverbLongTailSignal.drawActiveCircle() : this.reverbLongTailSignal.drawInactiveCircle();
        }
            
        //  amp mod
        this.looper.ampModActive ? this.ampModSignal.drawActiveCircle() : this.ampModSignal.drawInactiveCircle();
    }

    makeControlButtons() {
        // -------- ROUTE DELAY LOOP INTO REVERB -------- //
        this.delayRouteIntoReverbBut = createButton('ROUTE TO\nREVERB');    //  make button
        this.delayRouteIntoReverbBut.position(this.delayButX, this.parentButY + (1.1 * this.parentButHeight));    //  position
        this.delayRouteIntoReverbBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);   //  size
        this.delayRouteIntoReverbBut.mousePressed(() => {this.delayRouteIntoReverbProcess();});     //  start event to toggle routing

        // -------- DELAY TIME LFO -------- //
        this.delayTimeLFOBut = createButton('TIME \nLFO');  //  make button
        this.delayTimeLFOBut.position(1.075 * this.delayButX, this.parentButY + (1.1 * this.parentButHeight));    //  position
        this.delayTimeLFOBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);   //  size
        this.delayTimeLFOBut.mousePressed(() => {this.delayTimeLFOProcess();});     //  start event to trigger effect control

        // -------- DELAY FILTER LFO -------- //
        this.delayFilterLFOBut = createButton('FILTER LFO');    //  make button
        this.delayFilterLFOBut.position(1.15 * this.delayButX, this.parentButY + (1.1 * this.parentButHeight));    //  position
        this.delayFilterLFOBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight); //  size
        this.delayFilterLFOBut.mousePressed(() => {this.delayFilterLFOProcess();});     // start event to trigger effect control

        // -------- REVERB BACKWARDS -------- //
        this.reverbBackwardsBut = createButton('REVERSE\nREVERB');    //  make button
        this.reverbBackwardsBut.position(this.reverbButX, this.parentButY + (1.1 * this.parentButHeight));  //  position
        this.reverbBackwardsBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);
        this.reverbBackwardsBut.mousePressed(() => {this.reverbBackwardsProcess();});   //  switch reverbFor and reverbBack volumes

        // -------- REVERB LONG TAIL -------- //
        this.reverbLongTailBut = createButton('LONG\nTAIL');    //  make button
        this.reverbLongTailBut.position(1.1 * this.reverbButX, this.parentButY + (1.1 * this.parentButHeight));   //  position
        this.reverbLongTailBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight); //  size
        this.reverbLongTailBut.mousePressed(() => {this.reverbLongTailProcess();}); //  set reverb with a long reverb time

        // -------- AMP MOD NEW FREQ -------- //
        this.ampModNewFreqBut = createButton('CHANGE\nFREQ');   //  randomize amp mod frequency
        this.ampModNewFreqBut.position(this.ampModButX, this.parentButY + (1.1 * this.parentButHeight));    //  position
        this.ampModNewFreqBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);  //  size
        this.ampModNewFreqBut.mousePressed(() => {this.ampModNewFreqProcess();});   //  with every click, input a new frequency to oscillator

        // -------- AMP MOD FREQ LFO -------- //
        this.ampModFreqLFOBut = createButton('FREQ\nLFO');  //  apply LFO to the amp mod osc freq parameter
        this.ampModFreqLFOBut.position(1.15 * this.ampModButX, this.parentButY + (1.1 * this.parentButHeight));
        this.ampModFreqLFOBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);
        this.ampModFreqLFOBut.mousePressed(() => {this.ampModFreqLFOProcess();});   //  apply LFO to osc's freq parameter

        // -------- AMP MOD NEW DEPTH -------- //
        this.ampModNewDepthBut = createButton('NEW\nDEPTH');    //  apply new amp mod depth
        this.ampModNewDepthBut.position(1.3 * this.ampModButX, this.parentButY + (1.1 * this.parentButHeight));
        this.ampModNewDepthBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);
        this.ampModNewDepthBut.mousePressed(() => {this.ampModNewDepthProcess();});
    }

    removeControlButtons() {    //  delete effect control buttons, and reset the active booleans to reset
        this.looper.delayActive = false;
        this.looper.reverbActive = false;
        this.looper.ampModActive = false;
        
        this.delayRouteIntoReverbBut.remove();
        this.delayRouteIntoReverbActive = false;

        this.delayTimeLFOBut.remove();
        this.delayTimeLFOActive = false;

        this.delayFilterLFOBut.remove();
        this.delayFilterLFOActive = false;        

        this.reverbBackwardsBut.remove();
        this.reverbBackwardsActive = false;

        this.reverbLongTailBut.remove();

        this.ampModNewFreqBut.remove();

        this.ampModFreqLFOBut.remove();
        this.ampModFreqLFOActive = false;

        this.ampModNewDepthBut.remove();
    }

    delayRouteIntoReverbProcess() {
        if (this.looper.delayActive) {  //  only trigger if delay is already going
            if (!this.delayRouteIntoReverbActive) {
                this.looper.delay.connect(this.looper.reverbFor);  //  connect delay output to forward reverb node
                this.looper.delay.connect(this.looper.reverbBack);  //  connect delay output to backward reverb node
                this.looper.reverbFor.drywet(1);

                this.delayRouteIntoReverbActive = true; //  flip boolean
            }
            else {
                this.looper.delay.disconnect(); //  disconnect delay from all outputs
                this.looper.delay.connect();    //  connect delay back to master output

                this.delayRouteIntoReverbActive = false;    //  flip boolean
            }
        }
    }

    delayTimeLFOProcess() {     //  ----    delay time LFO
        if (this.looper.delayActive) {  //  only trigger if delay is already going
            if (!this.delayTimeLFOActive) {
                this.delayTimeLFO.freq(0.2);    //  set lfo to 0.2 Hz
                this.delayTimeLFO.amp(1);   //  all LFOs will be at amplitude of 1
                this.looper.delay.delayTime(this.delayTimeLFO); //  apply lfo to delay time

                this.delayTimeLFOActive = true;     //  flip boolean
            }
            else {
                this.delayTimeLFO.disconnect();     //  need to disconnect oscillator in order to get it off the delayTime param
                this.looper.delay.delayTime(0.5);   //  set delay time to a fixed amount

                this.delayTimeLFOActive = false;    //  flip boolean
            }
        }
    }

    delayFilterLFOProcess() {   //  ----    delay filter LFO
        if (this.looper.delayActive) {  //  only trigger if delay is already going
            if (!this.delayFilterLFOActive) {
                this.delayFilterLFO.freq(2);    //  set lfo speed   
                this.delayFilterLFO.amp(1);     //  ensure all lfos are at full 'volume' to get full spread 
                this.looper.delay.filter(this.delayFilterLFO, 7.5); //  apply lfo directly to filter cutoff here, with a Q of 7.5

                this.delayFilterLFOActive = true;
            }
            else {
                this.looper.delay.filter(4500, 1);  //  change filter cutoff to a static amount

                this.delayFilterLFOActive = false;
            }
        }
    }

    reverbBackwardsProcess() {
        if (this.looper.reverbActive) {     //  only trigger if reverb is already going
            if (!this.reverbBackwardsActive) {
                this.looper.reverbFor.drywet(0);    //  turn down forwards reverb
                this.looper.reverbBack.drywet(1);   //  turn up backwards reverb

                this.reverbBackwardsActive = true;
            }
            else {
                this.looper.reverbFor.drywet(1);    //  turn up forwards reverb
                this.looper.reverbBack.drywet(0);   //  turn down backwards reverb

                this.reverbBackwardsActive = false;
            }
        }
    }

    reverbLongTailProcess() {
        if (this.looper.reverbActive) {     //  only trigger if reverb is already going
            if (!this.reverbLongTailActive) {
                this.looper.reverbFor.set(10, 2, false);    //  set reverb time to 10 seconds
                this.looper.reverbBack.set(10, 2, true);

                this.reverbLongTailActive = true;
            }
            else {
                this.looper.reverbFor.set(3, 2, false);     //  set reverb time back to 3 seconds
                this.looper.reverbBack.set(3, 2, true);

                this.reverbLongTailActive = false;
            }
        }
    }

    ampModNewFreqProcess() {
        if (this.looper.ampModActive) {
            this.looper.ampModOsc.freq(Math.round(random(100)));    //  send new random freq into amp mod osc

            if (this.ampModFreqLFOActive) {     //  if amp mod frequency LFO is active, reset the LFO modulating that frequency
                this.ampModFreqLFO = new p5.Oscillator();
                this.ampModFreqLFO.start();
                this.ampModFreqLFO.disconnect();
                this.ampModFreqLFO.scale(-1, 1, random() * this.looper.ampModOsc.getFreq(), (1 + random()) * this.looper.ampModOsc.getFreq());
                this.ampModFreqLFO.amp(1);
                this.ampModFreqLFO.freq(random(2));

                this.looper.ampModOsc.freq(this.ampModFreqLFO);
            }
        }
    }

    ampModFreqLFOProcess() {    //  apply LFO output to the amp mod oscillator
        if (this.looper.ampModActive) {
            if (!this.ampModFreqLFOActive) {    //  because .scale() can't be called more than once per sketch, 
                this.ampModFreqLFO = new p5.Oscillator();   //  have to create a new p5.Oscillator every time user wants to change the frequency
                this.ampModFreqLFO.start();
                this.ampModFreqLFO.disconnect();
                this.ampModFreqLFO.scale(-1, 1, random() * this.looper.ampModOsc.getFreq(), (1 + random()) * this.looper.ampModOsc.getFreq());
                this.ampModFreqLFO.amp(1);
                this.ampModFreqLFO.freq(random(2));

                this.looper.ampModOsc.freq(this.ampModFreqLFO);     //  apply LFO output to carrier amp mod oscillator

                this.ampModFreqLFOActive = true;
            }
            else {
                this.looper.ampModOsc.freq(Math.round(random(20)));

                this.ampModFreqLFOActive = false;
            }
        }
    }

    ampModNewDepthProcess() {   //  change amp mod LFO depth (oscillator amplitude)
        if (this.looper.ampModActive) {
            this.looper.ampModOsc.amp(random());
        }
    }
}

//===================================================================================================================================================//
//===================================================================================================================================================//

/**
 * Class template for a single looper object
 * Will take in user recorderings, and run them through effects
 * This class will create the buttons to do all this, takes in coordinates as constructor arguments where the buttons go
 */
 class Phone_Looper {
    constructor(
        //  get variable input from user
        buttonX,    //  button x-coordinate
        buttonY,    //  button y-coordinate
        buttonWidth,    //  button width
        buttonHeight,    //  button height
        effButX,     //  effect button x-coordinate
        mic     //  single input source
    ) {
        //  define properties
        this.buttonX = buttonX; //  apply user input to class-instance variables
        this.buttonY = buttonY;
        this.buttonWidth = buttonWidth;
        this.buttonHeight = buttonHeight;
        this.effButX = effButX;
        this.effButWidth = 0.4 * this.buttonWidth;
        this.effButHeight = 0.5 * this.buttonHeight;
        this.effButY = this.buttonY + (1.2 * buttonHeight);

        this.mic = mic;    //  user input source (computer mic)
        this.recorder = new p5.SoundRecorder(); //  p5 sound recorder object
        this.soundFile = new p5.SoundFile();    //  p5 SoundFile object for audio buffer
        this.state = 0; //  'state' variable used to control button functions through recording -> playback
        this.delay = new p5.Delay();
        this.crazyDelay = new p5.Delay();
        this.delayState = 0;
        
        this.ampModOsc1 = new p5.Oscillator();
        this.ampModOsc1.start();
        this.ampModOsc1.disconnect();
        this.ampModOsc1.scale(-1, 1, 0, 1);
        this.ampModOsc1.amp(1);
        this.ampModOsc1.freq(Math.round(random(10)));
        

        this.button = createButton('START RECORD'); //  create button
        this.button.mousePressed(() => this.record());  //  when button is clicked, start record process

        this.clearButton;
        this.delayButton;
        this.delayActive = false;
        this.ampModButton;
        this.ampModActive = false;

        this.buttons;
    }

    //  set everything up
    init(_buttons) {
        this.mic.start();   //  set up input source
        this.recorder.setInput(this.mic);   //  connect microphone to recorder object

        this.button.position(this.buttonX, this.buttonY);   //  set up recorder button
        this.button.size(this.buttonWidth, this.buttonHeight);

        this.buttons = _buttons;    //  connect this looper instance with it's own buttons instance
    }
    
    // -------- GETTERS -------- //
    getbigButYDimensions() {    //  get the y dimensions of the record/play button to narrow down the mousePressed()
        return [this.buttonY, (this.buttonY + this.buttonHeight)];
    }

    getState() {
        return this.state;
    }
    
    getEffButX() {
        return this.effButX;
    }

    getEffButY() {
        return this.effButY;
    }

    getEffButWidth() {
        return this.effButWidth;
    }

    getEffButHeight() {
        return this.effButHeight;
    }


    //  use rec button to record voice and play back 
    record() {
        userStartAudio();   //  ensure audio is good to go

        if (this.state == 0 && this.mic.enabled) {    //  if nothing has been recorded yet and input is OK
        //  record into p5.SoundFile after 120 milliseconds to get past mouse click
        setTimeout(() => this.recorder.record(this.soundFile, 10), 120);
        
        this.button.html('STOP RECORDING')  //  change button text
        this.state++;   //  change state to move to play back
        }

        else if (this.state == 1) {    //  stop recorder and send result to soundFile
            this.recorder.stop();   //  stop recorder

            this.button.html('PLAY');   //  reassign button text
            this.state++;   //  increase state for record process
            this.button.size(this.buttonWidth/2, this.buttonHeight);    //  make room for new buttons

            this.addClearButton();  //  clear the buffer and start over
            this.addDelayButton();  //  apply delay
            this.addAmpModButton(); //  apply amplitude modulation
        }

        else if (this.state == 2) { //  play back recording
            this.soundFile.loop();
            this.soundFile.jump(0);

            this.button.html('STOP');
            this.state++;
        }

        else if(this.state == 3) {  //  stop playback
            this.soundFile.stop();

            this.button.html('PLAY');
            this.state--;
        }
    }

    addClearButton() {  //  button to reset buffer
        this.clearButton = createButton('CLEAR');
        this.clearButton.position(this.buttonX + (this.buttonWidth/2), this.buttonY);
        this.clearButton.size(this.buttonWidth/2, this.buttonHeight);


        this.clearButton.mousePressed(() => {  //  clear audio buffer and reset buttons
            this.soundFile.stop();  //  stop audio file
            this.button.size(this.buttonWidth, this.buttonHeight);  //  re-size button to fill gap
            this.soundFile = new p5.SoundFile();    //  intantiate new soundFile object
            this.button.html('START RECORD');       
            this.state = 0; //  reset state to restart record process

            this.ampModButton.remove();
            this.delayButton.remove();
            this.clearButton.remove();  
        });
    }

    addDelayButton() {  //  control delay output
        this.delayButton = createButton('DELAY');    //  create delay button
        this.delayButton.position(this.effButX, this.effButY);
        this.delayButton.size(this.effButWidth, this.effButHeight);

        this.delayButton.mousePressed(() => {   //  trigger delay
            if (!this.delayActive && this.delayState == 0) {    //  if delay is not active yet, make active
                this.delay.connect();
                this.delay.process(this.soundFile); //  connect delay to soundFile output
                this.delay.delayTime(random()); //  random delay time
                this.delay.feedback(0.65);   //  feedback amount
                this.delay.filter(2000);    //  lowpass filter (helpful with high feedback)
                this.delay.drywet(1);   //  full volume
                this.delay.setType('pingPong'); //  ping pong delay

                this.delayButton.html('CRAZY\nDELAY'); //  change button text

                this.delayActive = true;    //  flip boolean
                this.delayState++;
            }

            else if (this.delayActive && this.delayState == 1) {
                this.soundFile.disconnect();
                this.soundFile.connect(this.delay);

                //this.soundFile.connect(this.crazyDelay);
                this.crazyDelay.connect();
                this.crazyDelay.process(this.delay);
                this.crazyDelay.delayTime(random());
                this.crazyDelay.feedback(0.55);   //  feedback amount
                this.crazyDelay.filter(4000);    //  lowpass filter (helpful with high feedback)
                this.crazyDelay.drywet(1.0);   //  full volume

                this.buttons.delayTimeLFOProcess();
                this.buttons.delayFilterLFOProcess();

                this.delayButton.html('DEACTIVATE');
                this.delayState++;

            }

            else if (this.delayActive && this.delayState == 2) {  //  if delay is triggered, turn off
                this.soundFile.connect();

                this.delay.disconnect()
                this.crazyDelay.disconnect();

                this.buttons.delayFilterLFOProcess();

                this.delay.drywet(0);   //  volume level: 0
                this.crazyDelay.drywet(0);

                this.delayButton.html('DELAY');  //  change button

                this.delayActive = false;   //  flip boolean
                this.delayState = 0;
            }
        })
    }

    addAmpModButton() { //  control amplitude modulation
        this.ampModButton = createButton('ACTIVATE FLUTTER')
        this.ampModButton.position(3 * this.effButX, this.effButY);
        this.ampModButton.size(this.effButWidth, this.effButHeight);

        this.ampModButton.mousePressed(() => {
            if (!this.ampModActive) {
                this.ampModOsc1.start();
                let f = Math.round(random(20));
                this.ampModOsc1.freq(f);
                this.ampModOsc1.amp(1);
                this.soundFile.setVolume(this.ampModOsc1);

                this.buttons.ampModFreqLFOProcess();
    
                this.ampModButton.html('CALM DOWN');
                this.ampModActive = true;
            }
            
            else {
                this.ampModOsc1.stop();
                this.soundFile.setVolume(0.5);
    
                this.ampModButton.html('ACTIVATE FLUTTER');
                this.ampModActive = false;
            }
        });
    }
}

//===================================================================================================================================================//
//===================================================================================================================================================//

/**
 * Using p5.createButtons object to make html objects in the DOM
 * Because using the draw loop was potentially taxing the host server too much
 * 
 * We'll see if this fixes the problem
 */

 class Phone_Buttons {
    constructor(
        parentButX,     //  parent effect button x-coordinate
        parentButY,    //  parent effect button y-coordinate
        parentButWidth,    //  parent effect button width
        parentButHeight, //    parent effect button height
        looper  //  this buttons instance's of looper
    ) {
        this.parentButX = parentButX;
        this.parentButY = parentButY;
        this.parentButWidth = parentButWidth;
        this.parentButHeight = parentButHeight;
        this.looper = looper;

        this.delayButX = parentButX;    //  keep track of specific effect button x-coordinates
        this.ampModButX = 0.5 * parentButX;

        //  delay, amp mod signal circles
        this.delaySignal = new SignalCircle(1.01 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        this.ampModSignal = new SignalCircle(.51 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);

        this.delayTimeLFO = new p5.Oscillator();

        this.delayFilterLFO = new p5.Oscillator();
    }

    init() {    //  set up functions and objects that can only be called once
        this.delayTimeLFO.start();
        this.delayTimeLFO.disconnect();
        this.delayTimeLFO.scale(-1, 1, 0.001, 1);

        this.delayFilterLFO.start();    //  start up LFO
        this.delayFilterLFO.disconnect();
        this.delayFilterLFO.scale(-1, 1, 1, 4000);
    }

    effButAlerts() {    //  draw signal circles to determine if effect is active: red == off, green == on
        //  delay
        this.looper.delayActive ? this.delaySignal.drawActiveCircle() : this.delaySignal.drawInactiveCircle();
            
        //  amp mod
        this.looper.ampModActive ? this.ampModSignal.drawActiveCircle() : this.ampModSignal.drawInactiveCircle();
    }

    delayTimeLFOProcess() {     //  ----    delay time LFO
        if (this.looper.delayActive) {  //  if delay is active
            this.delayTimeLFO.freq(random(0.25));    //  set lfo to a very low number
            this.delayTimeLFO.amp(1);   //  all LFOs will be at amplitude of 1
            this.looper.crazyDelay.delayTime(this.delayTimeLFO); //  apply lfo to delay time
        }
    }

    delayFilterLFOProcess() {   //  ----    delay filter LFO
        if (this.looper.delayActive) {  //  if delay is active
            this.delayFilterLFO.freq(random(0.7));    //  set lfo speed   
            this.delayFilterLFO.amp(0.6);     //  ensure all lfos are at full 'volume' to get full spread 
            this.looper.crazyDelay.filter(this.delayFilterLFO, 5); //  apply lfo directly to filter cutoff here, with a Q of 7.5
        }
        else if (this.looper.delayState == 2) {
            this.looper.crazyDelay.filter(4500, 1);  //  change filter cutoff to a static amount
        }
    }

    ampModFreqLFOProcess() {    //  apply LFO output to the amp mod oscillator
        if (this.looper.ampModActive) { //  because .scale() can't be called more than once per sketch, 
            this.ampModFreqLFO = new p5.Oscillator();   //  have to create a new p5.Oscillator every time user wants to change the frequency
            this.ampModFreqLFO.start();
            this.ampModFreqLFO.disconnect();
            this.ampModFreqLFO.scale(-1, 1, random() * this.looper.ampModOsc1.getFreq(), (1 + random()) * this.looper.ampModOsc1.getFreq());
            this.ampModFreqLFO.amp(1);
            this.ampModFreqLFO.freq(random());

            this.looper.ampModOsc1.freq(this.ampModFreqLFO);     //  apply LFO output to carrier amp mod oscillator
        }
    }
}

//===================================================================================================================================================//
//===================================================================================================================================================//

/**
 * this is my custom work-around to the fact 
 * that p5 does not give the user direct access to oscillator output
 * 
 * Some p5 objects will accept an oscillator object directly as function arg,
 * but quite a few don't yet, this is the solution to that problem
 * 
 * Creates a p5.Oscillator object and a p5.FFT object. Runs the oscillator through the fft
 * and outputs the value of the first bin of the waveform() function
 */

 class Analyzer {
    constructor(
        low,    //  scaled output low end
        high,   //  scaled output high end
    ) {
        this.low = low;
        this.high = high;

        this.analyzedOsc = new p5.Oscillator('sine');   
        this.scaledOsc = new p5.Oscillator('sine');

        this.analyzedOsc.start();
        this.scaledOsc.start();

        this.analyzedOsc.disconnect();
        this.scaledOsc.disconnect();

        this.analyzedOsc.amp(1);

        this.scaledOsc.scale(-1, 1, this.low, this.high);
        this.scaledOsc.amp(1);
        
        this.fft = new p5.FFT();
        this.fft.setInput(this.analyzedOsc);
    }

    setFreq(f) {    //  always call this before process()!!!!!
        this.analyzedOsc.freq(f);   //  set oscillator frequency
        this.scaledOsc.freq(f);   //  set oscillator frequency
    }
    process() {     //  call this in the draw loop
        let waveform = this.fft.waveform();     //  creates a snapshot of amplitude values along the time domain
        let val = map(waveform[0], -1, 1, this.low, this.high);    //  scales output to get out of negative range

        return val;
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

//===================================================================================================================================================//
//===================================================================================================================================================//

/**
 * Class to create and control graphic buttons in the p5 draw loop
 * 
 * This class did not end up getting used as it was pulling too much power from the draw() loop
 * 
 */
 class Buttons_Unused {
    //  constructor params
    constructor(    
        parentButX,     //  parent effect button x-coordinate
        parentButY,    //  parent effect button y-coordinate
        parentButWidth,    //  parent effect button width
        parentButHeight, //    parent effect button height
        looper  //  this buttons instance's of looper
    ) {
        //  definte class properties
        this.parentButX = parentButX;   //  apply user input to class-instance variables
        this.parentButY = parentButY;
        this.parentButWidth = parentButWidth;
        this.parentButHeight = parentButHeight;
        this.circleR = this.parentButHeight;
        this.looper = looper;

        this.delayButX = parentButX;    //  keep track of specific effect button x-coordinates
        this.reverbButX = 0.75 * parentButX;
        this.ampModButX = 0.5 * parentButX;
        
        this.delayFilterLFO = new p5.Oscillator();
        this.delayFilterLFOActive = false;
        
        this.delayTimeLFO = new p5.Oscillator();
        this.delayTimeLFOActive = false;
    }

    init() {
        this.delayFilterLFO.start();    //  start up LFO
        this.delayFilterLFO.disconnect();
        this.delayFilterLFO.scale(-1, 1, 10, 5000);

        this.delayTimeLFO.start();
        this.delayTimeLFO.disconnect();
        this.delayTimeLFO.scale(-1, 1, 0, 1);
        
    }

    // -------- GETTERS -------- //
    //get

    effButAlerts() {    //  draw signal circles to determine if effect is active: red == off, green == on
        if (this.looper.delayActive) {  //  ---- delay
            fill(0, 255, 0);
            circle(1.01 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle(1.01 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        if (this.looper.reverbActive) { //  ---- reverb
            fill(0, 255, 0);
            circle(.76 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle(.76 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        if (this.looper.ampModActive) { //  ---- amp mod
            fill(0, 255, 0);
            circle(.51 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle(.51 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
    }

    drawDelayParamControls(mX = 0, mY = 0) {
        //  set up coordinate variables for effect param control buttons
        let delFiltLFOX = 1.01 * this.parentButX;   //  delay filter cutoff LFO
        let delTimeLFOX = 1.1 * this.parentButX;    //  delay time LFO
        let butY = this.parentButY + (1.6 * this.parentButHeight);  //  all these buttons will have the same y-coordinate

        textAlign(CENTER);  //  center label text with corresponding buttons
        textSize(15);
        
        //  ---- DELAY FILTER LFO ---- //
        let d = dist(mX, mY, delFiltLFOX, butY);
        if (d < this.circleR) {     //  if mouse clicked inside circle, toggle delay filter LFO active boolean
            this.delayFilterLFOActive ? this.delayFilterLFOActive = false : this.delayFilterLFOActive = true;
        }
        
        if (this.delayFilterLFOActive) {   //  if filter LFO is active, turn button green, activate lfo to filter cutoff  
            fill(0, 255, 0);    //  green
            
            this.delayFilterLFO.freq(2);    //  set lfo speed   
            this.delayFilterLFO.amp(1);     //  ensure all lfos are at full 'volume' to get full spread 
            this.looper.delay.filter(this.delayFilterLFO, 7.5); //  apply lfo directly to filter cutoff here, with a Q of 7.5
        }
        else {      //  if filter LFO is inactive, turn button red
            fill(255, 0, 0);    //  red

            this.looper.delay.filter(4500, 1);  //  change filter cutoff to a static amount
        }
        circle(delFiltLFOX, butY, this.circleR);    //  draw button

        // ---- DELAY TIME LFO ---- //
        d = dist(mX, mY, delTimeLFOX, butY);
        if (d < this.circleR) {     //  if mouse clicked inside circle, toggle delay filter LFO active boolean
            this.delayTimeLFOActive ? this.delayTimeLFOActive = false : this.delayTimeLFOActive = true;
        }

        if (this.delayTimeLFOActive) {   //  if filter LFO is active, turn button green, activate lfo to filter cutoff  
            fill(0, 255, 0);    //  green

            this.delayTimeLFO.freq(0.2);    //  set lfo to 0.2 Hz
            this.delayTimeLFO.amp(1);   //  all LFOs will be at amplitude of 1
            this.looper.delay.delayTime(this.delayTimeLFO); //  apply lfo to delay time

        }
        else {      //  if filter LFO is inactive, turn button red
            fill(255, 0, 0);    //  red

            this.delayTimeLFO.disconnect();     //  need to disconnect oscillator in order to get it off the delayTime param
            this.looper.delay.delayTime(0.5);   //  set delay time to a fixed amount
        }
        circle(delTimeLFOX, butY, this.circleR);    //  draw button
        
        fill(0);    //  black for text
        text('FILTER\nLFO', delFiltLFOX, butY + (1.1 * this.parentButHeight));
        text('DELAY TIME\nLFO', delTimeLFOX, butY + (1.1 * this.parentButHeight));
    }
}