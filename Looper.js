class Looper {
    constructor(
        //  get variable input from user
        recButX,    //  button x-coordinate
        recButY,    //  button y-coordinate
        recButWidth,    //  button width
        recButHeight    //  button height
    ) {
        //  define properties
        this.recButX = recButX;
        this.recButY = recButY;
        this.recButWidth = recButWidth;
        this.recButHeight = recButHeight;

        this.mic = new p5.AudioIn();    //  user input source (computer mic)
        this.recorder = new p5.SoundRecorder(); //  p5 sound recorder object
        this.soundFile = new p5.SoundFile();    //  p5 SoundFile object for audio buffer
        this.state = 0; //  'state' variable used to control recBut functions through recording -> playback

        this.recBut = createButton('START RECORD'); //  create button
        this.recBut.mousePressed(() => this.record());  //  when button is clicked, start record process


    }

    //  set everything up
    init() {
        this.mic.start();   //  set up input source
        this.recorder.setInput(this.mic);   //  connect microphone to recorder object

        this.recBut.position(this.recButX, this.recButY);   //  set up recorder button
        this.recBut.size(this.recButWidth, this.recButHeight);
    }
    
    //  use rec button to record voice and play back 
    record() {
        userStartAudio();   //  ensure audio is good to go

        if (this.state == 0 && this.mic.enabled) {    //  if nothing has been recorded yet and input is OK
        //  record into p5.SoundFile after 120 milliseconds to get past mouse click
        setTimeout(() => this.recorder.record(this.soundFile, 10), 120);
        
        this.recBut.html('STOP RECORDING!')  //  change button text
        this.state++;   //  change state to move to play back
        }

        else if (this.state == 1) {    //  stop recorder and send result to soundFile
            this.recorder.stop();   //  stop recorder

            this.recBut.html('PLAY RECORDING');
            this.state++;
        }

        else if (this.state == 2) { //  play back recording
            this.soundFile.play();
            this.soundFile.jump(0);
        }
    }
    
}