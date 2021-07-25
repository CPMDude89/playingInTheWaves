let w = window.innerWidth;
let h = window.innerHeight;
let looper1, looper2, looper3, looper4, looper5;
let buttons1, buttons2, buttons3, buttons4, buttons5;
let inMic;
let bigButX=(4 * w/5), bigButY=(h/5), bigButWidth=(w/10), bigButHeight=(h/10);
let effectButtonX = 4.5 * (w/7);
let recBut, recButX=(0.02 * w), recButY=bigButY, recButWidth=(w/14), recButHeight=(h/10), recState=0, outFile, fileClearButton, fileDownloadButton;

function preload() {
        
}

function setup() {
    canv = createCanvas(w, h);
    inMic = new p5.AudioIn();

    looper1 = new Looper(bigButX, bigButY, bigButWidth, bigButHeight, effectButtonX, inMic);  
    buttons1 = new Buttons(looper1.getEffButX(), looper1.getEffButY(), looper1.getEffButWidth(), looper1.getEffButHeight(), looper1);
    looper1.init(buttons1);  //  initialize button and recorder
    buttons1.init();

    looper2 = new Looper(bigButX, 2 * bigButY, bigButWidth, bigButHeight, effectButtonX, inMic);
    buttons2 = new Buttons(looper2.getEffButX(), looper2.getEffButY(), looper2.getEffButWidth(), looper2.getEffButHeight(), looper2);
    looper2.init(buttons2);  //  initialize button and recorder
    buttons2.init();  
    
    looper3 = new Looper(bigButX, 3 * bigButY, bigButWidth, bigButHeight, effectButtonX, inMic);
    buttons3 = new Buttons(looper3.getEffButX(), looper3.getEffButY(), looper3.getEffButWidth(), looper3.getEffButHeight(), looper3);
    looper3.init(buttons3);
    buttons3.init();  

    looper4 = new Looper(bigButX, 4 * bigButY, bigButWidth, bigButHeight, effectButtonX, inMic);
    buttons4 = new Buttons(looper4.getEffButX(), looper4.getEffButY(), looper4.getEffButWidth(), looper4.getEffButHeight(), looper4);
    looper4.init(buttons4);  
    buttons4.init();

    recBut = createButton('RECORD CLIP');
    recBut.position(recButX, recButY);
    recBut.size(recButWidth, recButHeight);
    recBut.mousePressed(recordOutput);
    outFile = new p5.SoundFile();
    outputRecorder = new p5.SoundRecorder();
    outputRecorder.setInput();
}

function draw() {
    canv.background(128, 128, 255);    //  draw background

    fill(0);
    textAlign(CENTER);  //  page title
    textSize(45);
    text('Playing In The Waves: A Play-Based Approach to Sound Design', w/2, h/11);

    textAlign(LEFT);    //  set up track names
    textSize(28);
    text('Track 1', bigButX, (bigButY - (0.01 * bigButY))); //  track names 1-5
    text('Track 2', bigButX, (2*bigButY - (0.01 * 2 * bigButY)));
    text('Track 3', bigButX, (3*bigButY - (0.01 * 3 * bigButY)));
    text('Track 4', bigButX, (4*bigButY - (0.01 * 4 * bigButY)));
    

    fill(0, 179, 0);
    textSize(18);
    if (looper1.getState() > 1 ) {   //  once effect buttons are displayed
        buttons1.effButAlerts();    //  draw signal lights if to keep track of effect activity/inactivity

        if (looper1.ampModActive) {     //  print to screen the frequency value of the amp mod oscillator
            let val = looper1.ampModOsc.getFreq();
            fill(0);
            text(val + " Hz", 1.02 * buttons1.ampModButX, buttons1.parentButY + (3.5 * buttons1.parentButHeight));

            let a = looper1.ampModOsc.getAmp().toFixed(2);
            text(a, 1.32 * buttons1.ampModButX, buttons1.parentButY + (3.5 * buttons1.parentButHeight));

            if (buttons1.ampModFreqLFOActive) { //  print to screen the frequency of the amp mod freq oscillator
            let f = buttons1.ampModFreqLFO.getFreq().toFixed(2);
            fill(0);
            text(f + " Hz", 1.17 * buttons1.ampModButX, buttons1.parentButY + (3.5 * buttons1.parentButHeight));
            }
        }
    }

    if (looper2.getState() > 1 ) {   //  once effect buttons are displayed
        buttons2.effButAlerts();    //  draw signal lights if to keep track of effect activity/inactivity

        if (looper2.ampModActive) {     //  print to screen the frequency value of the amp mod oscillator
            let val = looper2.ampModOsc.getFreq();
            fill(0);
            text(val + " Hz", 1.02 * buttons2.ampModButX, buttons2.parentButY + (3.5 * buttons2.parentButHeight));

            let a = looper2.ampModOsc.getAmp().toFixed(2);
            text(a, 1.32 * buttons2.ampModButX, buttons2.parentButY + (3.5 * buttons2.parentButHeight));

            if (buttons2.ampModFreqLFOActive) { //  print to screen the frequency of the amp mod freq oscillator
                let f = buttons2.ampModFreqLFO.getFreq().toFixed(2);
                fill(0);
                text(f + " Hz", 1.17 * buttons2.ampModButX, buttons2.parentButY + (3.5 * buttons2.parentButHeight));
                }
        }      
    }

    if (looper3.getState() > 1 ) {   //  once effect buttons are displayed
        buttons3.effButAlerts();    //  draw signal lights if to keep track of effect activity/inactivity

        if (looper3.ampModActive) {     //  print to screen the frequency value of the amp mod oscillator
            let val = looper3.ampModOsc.getFreq();
            fill(0);
            text(val + " Hz", 1.02 * buttons3.ampModButX, buttons3.parentButY + (3.5 * buttons3.parentButHeight));

            let a = looper3.ampModOsc.getAmp().toFixed(2);
            text(a, 1.32 * buttons3.ampModButX, buttons3.parentButY + (3.5 * buttons3.parentButHeight));

            if (buttons3.ampModFreqLFOActive) { //  print to screen the frequency of the amp mod freq oscillator
                let f = buttons3.ampModFreqLFO.getFreq().toFixed(2);
                fill(0);
                text(f + " Hz", 1.17 * buttons3.ampModButX, buttons3.parentButY + (3.5 * buttons3.parentButHeight));
                }
        }
    }

    if (looper4.getState() > 1 ) {   //  once effect buttons are displayed
        buttons4.effButAlerts();    //  draw signal lights if to keep track of effect activity/inactivity

        if (looper4.ampModActive) {     //  print to screen the frequency value of the amp mod oscillator
            let val = looper4.ampModOsc.getFreq();
            fill(0);
            text(val + " Hz", 1.02 * buttons4.ampModButX, buttons4.parentButY + (3.5 * buttons4.parentButHeight));

            let a = looper4.ampModOsc.getAmp().toFixed(2);
            text(a, 1.32 * buttons4.ampModButX, buttons4.parentButY + (3.5 * buttons4.parentButHeight));

            if (buttons4.ampModFreqLFOActive) { //  print to screen the frequency of the amp mod freq oscillator
                let f = buttons4.ampModFreqLFO.getFreq().toFixed(2);
                fill(0);
                text(f + " Hz", 1.17 * buttons4.ampModButX, buttons4.parentButY + (3.5 * buttons4.parentButHeight));
                }
        }
    }
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