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
        effButX     //  effect button x-coordinate
    ) {
        //  define properties
        this.buttonX = buttonX; //  apply user input to class-instance variables
        this.buttonY = buttonY;
        this.buttonWidth = buttonWidth;
        this.buttonHeight = buttonHeight;
        this.effButX = effButX;
        this.effButY = buttonY;
        this.effButWidth = 0.5 * this.buttonWidth;
        this.effButHeight = 0.7 * this.buttonHeight;

        this.mic = new p5.AudioIn();    //  user input source (computer mic)
        this.recorder = new p5.SoundRecorder(); //  p5 sound recorder object
        this.soundFile = new p5.SoundFile();    //  p5 SoundFile object for audio buffer
        this.state = 0; //  'state' variable used to control button functions through recording -> playback
        this.ampModOsc = new p5.Oscillator();
        this.delay = new p5.Delay();
        this.reverbFor = new p5.Reverb();

        this.button = createButton('START RECORD'); //  create button
        this.button.mousePressed(() => this.record());  //  when button is clicked, start record process

        this.clearButton;
        this.delayButton;
        this.delayActive = false;
        this.reverbButton;
        this.reverbActive = false;
        this.ampModButton;
        this.ampModActive = false;
    }

    //  set everything up
    init() {
        this.mic.start();   //  set up input source
        this.recorder.setInput(this.mic);   //  connect microphone to recorder object

        this.button.position(this.buttonX, this.buttonY);   //  set up recorder button
        this.button.size(this.buttonWidth, this.buttonHeight);
    }
    
    // -------- GETTERS -------- //
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

            this.clearButton.remove();  //  get rid of buttons
            this.reverbButton.remove();
            this.ampModButton.remove();
            this.delayButton.remove();
        });
    }

    addDelayButton() {  //  control delay output
        this.delayButton = createButton('DELAY ON');    //  create delay button
        this.delayButton.position(this.effButX, this.buttonY);
        this.delayButton.size(this.effButWidth, this.effButHeight);

        this.delayButton.mousePressed(() => {   //  trigger delay
            if (!this.delayActive) {    //  if delay is not active yet, make active
                this.delay.process(this.soundFile); //  connect delay to soundFile output
                this.delay.delayTime(0.55); //  delay time
                this.delay.feedback(0.6);   //  feedback amount
                this.delay.filter(2000);    //  lowpass filter (helpful with high feedback)
                this.delay.drywet(1);   //  full volume
                this.delay.setType('pingPong'); //  ping pong delay

                this.delayButton.html('DELAY OFF'); //  change button text

                this.delayActive = true;    //  flip boolean
            }
            
            else {  //  if delay is triggered, turn off
                this.delay.drywet(0);   //  volume level: 0

                this.delayButton.html('DELAY ON');  //  change button

                this.delayActive = false;   //  flip boolean
            }
        })
    }

    addReverbButton() {
        this.reverbButton = createButton('REVERB ON');
        this.reverbButton.position(0.9 * this.effButX, this.buttonY);
        this.reverbButton.size(0.5 * this.buttonWidth, 0.7 * this.buttonHeight);

        this.reverbButton.mousePressed(() => {
            if (!this.reverbActive) {
                this.reverbFor.process(this.soundFile, 3, 2);
                this.reverbFor.drywet(1);

                this.reverbButton.html('REVERB OFF');

                this.reverbActive = true;
            }

            else {
                this.reverbFor.drywet(0);

                this.reverbButton.html('REVERB ON');

                this.reverbActive = false;
            }
        })
        /*  *********  test to make reverb go backwards - forwards
            *********   doesn't work, once reverb is reversed, it will not go back

        this.reverbReverseButton = createButton('REVERB BACKWARDS ON');
        this.reverbReverseButton.position(0.9 * this.effButX, 1.5 * this.buttonY);
        this.reverbReverseButton.size(0.5 * this.buttonWidth, 0.7 * this.buttonHeight);
        this.reverbReverseActive = false;

        this.reverbReverseButton.mousePressed(() => {
            if (!this.reverbReverseActive) {
                this.reverb.set(3, 2, true);
                this.reverbReverseButton.html('GO BACK TO NORMAL');
                this.reverbReverseActive = true;
            }

            else {
                this.reverb.disconnect();
                this.reverb = new p5.Reverb();
                this.reverb.set(3, 2, false);
                this.reverb.drywet(1);
                this.reverbReverseButton.html('MAKE QUIETER');
                this.reverbReverseActive = false;
            }
        })
        */
    }

    addAmpModButton() { //  control amplitude modulation
        this.ampModButton = createButton('AMP MOD ON')
        this.ampModButton.position(0.8 * this.effButX, this.buttonY);
        this.ampModButton.size(0.5 * this.buttonWidth, 0.7 * this.buttonHeight);
        
        this.ampModOsc.start();
        this.ampModOsc.disconnect();
        this.ampModOsc.scale(-1, 1, 0, 1);

        this.ampModButton.mousePressed(() => {
            if (!this.ampModActive) {
                this.ampModOsc.start();
                this.ampModOsc.freq(20);
                this.ampModOsc.amp(1);
                this.soundFile.setVolume(this.ampModOsc);
    
                this.ampModButton.html('AMP MOD OFF');
                this.ampModActive = true;
            }
            
            else {
                this.ampModOsc.stop();
                this.soundFile.setVolume(0.5);
    
                this.ampModButton.html('AMP MOD ON');
                this.ampModActive = false;
            }
        });
    }

    
}