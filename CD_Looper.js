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
        this.buttonX = buttonX; //  properties from user input
        this.buttonY = buttonY;
        this.buttonWidth = buttonWidth;
        this.buttonHeight = buttonHeight;
        this.effButX = effButX;

        this.mic = new p5.AudioIn();    //  user input source (computer mic)
        this.recorder = new p5.SoundRecorder(); //  p5 sound recorder object
        this.soundFile = new p5.SoundFile();    //  p5 SoundFile object for audio buffer
        this.state = 0; //  'state' variable used to control button functions through recording -> playback
        this.ampModOsc = new p5.Oscillator();
        this.delay = new p5.Delay();

        this.button = createButton('START RECORD'); //  create button
        this.button.mousePressed(() => this.record());  //  when button is clicked, start record process

        this.clearButton;
        this.ampModButton;
        this.delayButton;
    }

    //  set everything up
    init() {
        this.mic.start();   //  set up input source
        this.recorder.setInput(this.mic);   //  connect microphone to recorder object

        this.button.position(this.buttonX, this.buttonY);   //  set up recorder button
        this.button.size(this.buttonWidth, this.buttonHeight);
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

            this.button.html('PLAY');
            this.state++;
            this.button.size(this.buttonWidth/2, this.buttonHeight);

            this.addClearButton();
            this.addAmpModButton();
            this.addDelayButton();

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
            //console.log('asdl;kjasdfl;kjasdf');
            this.soundFile.stop();
            this.button.size(this.buttonWidth, this.buttonHeight);
            this.soundFile = new p5.SoundFile();
            this.button.html('START RECORD');
            this.state = 0;
            this.clearButton.remove();
        });
    }

    addAmpModButton() { //  control amplitude modulation
        this.ampModButton = createButton('AMP MOD ON')
        this.ampModButton.position(0.9 * this.effButX, this.buttonY);
        this.ampModButton.size(0.5 * this.buttonWidth, 0.7 * this.buttonHeight);

        this.ampModButton.mousePressed(() => {
            this.ampModOsc.start();
            this.ampModOsc.disconnect();
            this.ampModOsc.freq(20);
            this.ampModOsc.amp(1);

            this.soundFile.setVolume(this.ampModOsc.scale(-1, 1, 0, 1));
        })
    }

    addDelayButton() {  //  control delay output
        this.delayButton = createButton('DELAY ON');
        this.delayButton.position(this.effButX, this.buttonY);
        this.delayButton.size(0.5 * this.buttonWidth, 0.7 * this.buttonHeight);

        this.delayButton.mousePressed(() => {
            this.delay.process(this.soundFile);
            this.delay.delayTime(0.55);
            this.delay.feedback(0.6);


        })
        

    }


    
}