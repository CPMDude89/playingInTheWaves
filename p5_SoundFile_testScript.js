let soundFile;
let isLoadedTest;
let reverseTest = false;
let onendedTest;
let playButton;
let loopButton;
let setLoopButton;
let pauseButton;
let jumpButton;
let stopButton;
let reverseButton;
let removeCueButton;
let clearCuesButton;
let ampButton;
let fftButton;
let volumeSlider;
let panSlider;
let rateSlider;
let cuedText = "";
let cueID;
let amp;
let ampActive = false;
let fft;
let fftActive = false;


function preload() 
{
  //soundFormats('ogg', 'mp3'); 
  soundFile = loadSound('sounds/mothership_short.mp3');
}

function playSong()
{
    soundFile.play();
}

function loopSong()
{
    soundFile.loop();
}

function changeLoopStatus()
{
    if (soundFile.isLooping() == true)
    {
        soundFile.setLoop(false);
    }
    else
    {
        soundFile.setLoop(true);
    }
}

function jumpTo1Sec()
{
    soundFile.jump(1.0);
}

function pauseSong()
{
    soundFile.pause();
}

function stopSong()
{
    soundFile.stop();
}

function onEndedFunction()
{
    console.log("onended() is telling you that the audio has ended");
}

function reverseSong()
{
    if (reverseTest)    //  flip print statement if buffer is reversed or not
    {
        reverseTest = false;
    }
    else
    {
        reverseTest = true;
    }

    //soundFile.stop();
    //soundFile.pause();
    soundFile.reverseBuffer();
    soundFile.play();
}

function changeCuedText(text_)
{
    cuedText = text_;
}

function removeLastCue()
{
    soundFile.removeCue(cueID);
}

function clearCuesFunction()
{
    soundFile.clearCues();
}

function toggleAmp()
{
    if (ampActive)
    {
        ampActive = false;
    }
    else
    {
        ampActive = true;
    }
}

function toggleFFT()
{
    if (fftActive)
    {
        fftActive = false;
    }
    else
    {
        fftActive = true;
    }
}

function setup()
{
    let canv = createCanvas(1024, 500);
    amp = new p5.Amplitude();
    //mic = new p5.AudioIn(); 
    //mic.start();
    fft = new p5.FFT();

    //  song control buttons
    playButton = createButton("PLAY SONG"); //  play button
    playButton.mousePressed(playSong);

    loopButton = createButton("LOOP SONG"); //  loop button
    loopButton.mousePressed(loopSong);

    setLoopButton = createButton("SET LOOP");   //  change loop status
    setLoopButton.mousePressed(changeLoopStatus);

    jumpButton = createButton("JUMP TO 1 SEC"); //  jump button
    jumpButton.mousePressed(jumpTo1Sec);

    pauseButton = createButton("PAUSE SONG");   //  pause button
    pauseButton.mousePressed(pauseSong);

    stopButton = createButton("STOP SONG"); //  stop button
    stopButton.mousePressed(stopSong);

    reverseButton = createButton("REVERSE BUFFER"); //  reverse button
    reverseButton.mousePressed(reverseSong);

    removeCueButton = createButton("REMOVE LAST CUE");  //  removeCue()
    removeCueButton.mousePressed(removeLastCue);

    clearCuesButton = createButton("CLEAR ALL CUES");   //  clearCues()
    clearCuesButton.mousePressed(clearCuesFunction);

    ampButton = createButton("TOGGLE AMP SENSE");   //  clear reactive amplitude ellipse
    ampButton.mousePressed(toggleAmp);

    fftButton = createButton("TOGGLE FFT");   //  clear fft
    fftButton.mousePressed(toggleFFT);

    //  volume control
    volumeSlider = createSlider(0, 1.0, 0.4, 0.01);

    //  pan control
    panSlider = createSlider(-1.0, 1.0, 0.0, 0.01);

    // playback rate control
    rateSlider = createSlider(-3.0, 3.0, 1.0, 0.01);
} 


function draw()
{
    background(102, 153, 0);    //  call background() every frame to clear old text

    if (ampActive)
    {
        //  draw amplitude ellipse to demonstrate p5.Amplitude()
        var vol = amp.getLevel();
        var diam = map(vol, 0.0, 1.0, 50, 200);

        fill(120);
        ellipse(800, 50, diam);
        fill(0);
    }

    //  use FFT() to draw spectrum analysis at bottom of canvas
    if (fftActive)
    {
        var spectrum = fft.analyze();
        stroke(225);
        for (let i = 0; i < spectrum.length; i++)
        {
            let specAmp = spectrum[i];
            let y_Val = map(specAmp, 0.0, 255, height, 0.0);
            line(i, height, i, y_Val);
        }
        noStroke();
    }



    soundFile.onended(onEndedFunction);     //  sends a message to the console if the song ends

    //  check isLoaded()
    let isLoadedX;
    let isLoadedText;
    isLoadedTest = soundFile.isLoaded();
    if (!isLoadedTest)
    {
        isLoadedText = "isLoaded() has not finished loading and returns: ";
        isLoadedX = 50;
    }
    else
    {
        isLoadedText = "isLoaded() has finished loading and returns: ";
        isLoadedX = 150;
    }
    
    //  volume control and print it
    soundFile.setVolume(volumeSlider.value());
    let volControlVal = "Song's volume is currently: " + volumeSlider.value();

    // pan control and print it
    soundFile.pan(panSlider.value());
    let panControlVal = "Song's stereo position is currently: " + soundFile.getPan();

    //  rate control and print it
    soundFile.rate(rateSlider.value());
    let rateControlVal = "Song's playback rate is currently: " + rateSlider.value();

    testFunction(isLoadedText, isLoadedX, volControlVal, panControlVal, rateControlVal);
    
    soundFile.addCue(0.0, changeCuedText, "addCue() is triggering");
    soundFile.addCue(1.0, changeCuedText, "addCue() is triggering these words");
    soundFile.addCue(1.5, changeCuedText, "addCue() is triggering these words that are");
    //  check to see if I'm doing this right
    cueID = soundFile.addCue(2.0, changeCuedText, "addCue() is triggering these words that are being printed to the screen!");
}

function testFunction(isLoadedText_, isLoadedX_, volControlVal_, panControlVal_, rateControlVal_)
{
    let testPrintOut = 
        soundFile.isLoaded();

    textSize(20);
    text("This audio file's duration in seconds is: " + soundFile.duration(), 100, 60);
    text("This audio file's playback position in seconds is: " + soundFile.currentTime(), 100, 80);
    text(isLoadedText_ + testPrintOut, isLoadedX_, 100);
    text(volControlVal_, 100, 120);
    text(panControlVal_, 100, 140);
    text(rateControlVal_, 100, 160);
    text("This audio file has this many channels: " + soundFile.channels(), 100, 180);
    text("This audio file's sample rate is: " + soundFile.sampleRate(), 100, 200);
    text("The amount of 'frames' in this audio file is: " + soundFile.frames(), 100, 220);
    text("The audio buffer is reversed true/false: " + reverseTest, 100, 240);
    text("isPlaying() is returning: " + soundFile.isPlaying(), 100, 260);
    text("isLooping() is returning: " + soundFile.isLooping(), 100, 280);
    text("isPaused() is returning: " + soundFile.isPaused(), 100, 300);
    text("getPan() is returning: " + soundFile.getPan(), 100, 320);
    text(cuedText, 100, 340);
}