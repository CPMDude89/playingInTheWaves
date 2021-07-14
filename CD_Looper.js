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
                this.ampModOsc.freq(Math.round(random(20)));
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

/**
 * Basic record button class, will also handle playback clear button
 */

class RecordButton {
    constructor(
        //  get variable input from user
        buttonX,    //  button x-coordinate
        buttonY,    //  button y-coordinate
        buttonWidth,    //  button width
        buttonHeight,    //  button height
        mic     //  single input source
    ) {
        //  define properties
        this.buttonX = buttonX; //  apply user input to class-instance variables
        this.buttonY = buttonY;
        this.buttonWidth = buttonWidth;
        this.buttonHeight = buttonHeight;

        this.mic = mic;    //  user input source (computer mic)
        this.mic.start();   //  turn on user input

        this.recorder = new p5.SoundRecorder(); //  p5 sound recorder object
        this.recorder.setInput(this.mic);
        
        this.soundFile = new p5.SoundFile();    //  p5 SoundFile object for audio buffer
        this.state = 0; //  'state' variable used to control button functions through recording -> playback

        this.recorderButton = createButton('RECORD');    //  set up recording button
        this.recorderButton.position(recButX, recButY);
        this.recorderButton.size(recButWidth, recButHeight);
        this.recorderButton.mousePressed(() => this.recordAudio());

        this.recordActive = false;
        this.showButtonsActive = false;
    }

    recordAudio() {
        userStartAudio();   //  ensure browser audio is functioning
    
        if (this.state == 0 && this.mic.enabled) {
            //  wait 120 ms to get past mouse click
            setTimeout(() => this.recorder.record(this.soundFile), 120);     //  record user input into buffer
            this.recorderButton.html('FINISH RECORDING');  //  change button text
            this.recordActive = true;    //  switch boolean to trigger recording light
            this.state++;  //  change state to move record process to next step
        }
    
        else if (this.state == 1) {
            this.recorder.stop();    //  stop record process
            this.recorderButton.html('PLAY');    //  change button text
            this.recordActive = false;   //  switch boolean to remove recording light
            this.state++;    //  change state to move record process to next step
            this.showButtons();  //  show clear and amp mod buttons
        }
    
        else if (this.state == 2) {
            this.soundFile.loop();   //  play recorded audio
            this.recorderButton.html('STOP');    //  change button text
            this.state++;    //  change state to allow user to stop audio
        }
    
        else if (this.state == 3) {
            this.soundFile.stop();   //  stop recorded audio
            this.recorderButton.html('PLAY');
            this.state--;    //  change state to allow user to play audio
        }
    }
    
    showButtons() {
        /*
        ampModButton = createButton('ACTIVATE\nAMP MOD')   //  set up amplitude modulation on/off button
        ampModButton.position(AMButX, AMButY);
        ampModButton.size(AMButWidth, AMButHeight);
        ampModButton.mousePressed(activateAmpMod);
*/

console.log("here we are");

    }
}