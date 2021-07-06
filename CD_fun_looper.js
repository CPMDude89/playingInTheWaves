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
        this.effButWidth = 0.4 * this.buttonWidth;
        this.effButHeight = 0.5 * this.buttonHeight;
        this.effButY = this.buttonY + (1.2 * buttonHeight);

        this.mic = mic;    //  user input source (computer mic)
        this.recorder = new p5.SoundRecorder(); //  p5 sound recorder object
        this.soundFile = new p5.SoundFile();    //  p5 SoundFile object for audio buffer
        this.state = 0; //  'state' variable used to control button functions through recording -> playback
        this.delay = new p5.Delay();
        
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
        this.delayButton = createButton('TAKE\nOFF');    //  create delay button
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

                this.delayButton.html('LAND\nSPACESHIP'); //  change button text

                this.delayActive = true;    //  flip boolean
            }
            
            else {  //  if delay is triggered, turn off
                this.delay.drywet(0);   //  volume level: 0

                this.delayButton.html('TAKE OFF');  //  change button

                this.delayActive = false;   //  flip boolean
            }

            this.buttons.delayTimeLFOProcess();
            this.buttons.delayFilterLFOProcess();
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
    
                this.ampModButton.html('CALM DOWN');
                this.ampModActive = true;
            }
            
            else {
                this.ampModOsc1.stop();
                this.soundFile.setVolume(0.5);
    
                this.ampModButton.html('ACTIVATE FLUTTER');
                this.ampModActive = false;
            }

            this.buttons.ampModFreqLFOProcess();
        });
    }

    
}