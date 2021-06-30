class Looper {
    constructor(
        //  get variable input from user
        recButX,
        recButY,
        recButSize
    ) {
        //  define properties
        this.recButX = recButX;
        this.recButY = recButY;
        this.recButSize = recButSize;

        this.mic = new p5.AudioIn();
        this.recorder = new p5.SoundRecorder();
        this.soundFile = new p5.SoundFile();
        this.state = 0;
        this.osc = new p5.Oscillator();
        this.recBut = createButton('START RECORD');
        this.recBut.mousePressed(() => this.record());


    }

    //  set everything up
    init() {
        this.mic.start();   //  set up input source
        this.recorder.setInput(this.mic);   //  connect microphone to recorder object

        this.recBut.position(this.recButX, this.recButY);   //  set up recorder button
        this.recBut.size(this.recButSize);

        this.osc.freq(200);
        this.osc.amp(0.2);
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