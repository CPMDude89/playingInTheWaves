let w = window.innerWidth, h = window.innerHeight;
let looper1, looper2;
let buttons1, buttons2;
let inMic;
let bigButX=(0.15 * w), bigButY=(0.2 * h), bigButWidth=(0.75 * w), bigButHeight=(h/5);
let effectButtonX = 1.3 * bigButX;
let recBut, recButX=(w/12), recButY=(0.1 * h), recButWidth=(0.3 * w), recButHeight=(h/15), recState=0, outFile, fileClearButton, fileDownloadButton;


function setup() {
    canv = createCanvas(w, h);
    inMic = new p5.AudioIn();

    looper1 = new Phone_Looper(bigButX, bigButY, bigButWidth, bigButHeight, effectButtonX, inMic);  
    buttons1 = new Phone_Buttons(looper1.getEffButX(), looper1.getEffButY(), looper1.getEffButWidth(), looper1.getEffButHeight(), looper1);
    looper1.init(buttons1);  //  initialize button and recorder
    buttons1.init();

    looper2 = new Phone_Looper(bigButX, 3 * bigButY, bigButWidth, bigButHeight, effectButtonX, inMic);
    buttons2 = new Phone_Buttons(looper2.getEffButX(), looper2.getEffButY(), looper2.getEffButWidth(), looper2.getEffButHeight(), looper2);
    looper2.init(buttons2);  //  initialize button and recorder
    buttons2.init();

    recBut = createButton('RECORD CLIP');
    recBut.position(recButX, recButY);
    recBut.size(recButWidth, recButHeight);
    recBut.mousePressed(recordOutput);
    outFile = new p5.SoundFile();
    outputRecorder = new p5.SoundRecorder();
    outputRecorder.setInput();
}

function draw() {
    background(50, 200, 10);

    textSize(30);
    fill(0);
    textAlign(CENTER);
    text('Playing In The Waves', 0.5 * w, 0.1 * h);
}

function recordOutput() {
    if (recState == 0) {
        outputRecorder.record(outFile)  //  record sketch output to outFile
        
        recBut.html('STOP RECORDING');  //  change text to alert user that recording is happening

        recState++;     //  change state to stop record process
    }
    else if (recState == 1) {
        outputRecorder.stop();  //  stop record process

        recBut.html('PLAY');    //  change text
        recState++;
        recBut.size(0.5 * recButWidth, recButHeight);

        createFileButtons();
    }
    else if (recState == 2) {   //  play recording
        outFile.play();
        outFile.jump(0);

        recBut.html('STOP');
        recState++;
    }
    else if (recState == 3) {   //  stop playback
        outFile.stop();
        recBut.html('PLAY');
        recState--;
    }
}

function createFileButtons() {  //  clear outFile and make room to re-record
    fileClearButton = createButton('CLEAR');
    fileClearButton.position(recButX + (0.5 * recButWidth), recButY);
    fileClearButton.size(0.5 * recButWidth, recButHeight);
    fileClearButton.mousePressed(function() {   //  clear and reset record button
        outFile.stop()  //  just in case file is actively playing back when button is pressed
        recBut.size(recButWidth, recButHeight);     //  re-size main record button
        outFile = new p5.SoundFile();   //  reset sound file object with new assignment
        recBut.html('RECORD CLIP');     //  reset button text
        recState = 0;   //  reset record counter to reset whole record process

        fileDownloadButton.remove();
        fileClearButton.remove();
    });

    fileDownloadButton = createButton('DOWNLOAD');
    fileDownloadButton.position(recButX + recButWidth, recButY);
    fileDownloadButton.size(0.8 * recButWidth, recButHeight);
    fileDownloadButton.mousePressed(function() {
        outFile.save('Playing_In_The_Waves.wav');
    })
}