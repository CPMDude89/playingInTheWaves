let soundFile;
let isLoadedTest;
let playButton;
let loopButton;
let pauseButton;
let jumpButton;
let stopButton;
let volumeSlider;
let panSlider;
let rateSlider;

function preload() 
{
  //soundFormats('ogg', 'mp3'); 
}

function playSong()
{
    soundFile.play();
}

function loopSong()
{
    soundFile.loop();
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

function setup()
{
    let canv = createCanvas(800, 500);
    soundFile = loadSound('sounds/mothership_short.mp3');

    //  song control buttons
    playButton = createButton("PLAY SONG"); //  play button
    playButton.mousePressed(playSong);

    loopButton = createButton("LOOP SONG"); //  loop button
    loopButton.mousePressed(loopSong);

    jumpButton = createButton("JUMP TO 1 SEC"); //  jump button
    jumpButton.mousePressed(jumpTo1Sec);

    pauseButton = createButton("PAUSE SONG");   //  pause button
    pauseButton.mousePressed(pauseSong);

    stopButton = createButton("STOP SONG"); //  stop button
    stopButton.mousePressed(stopSong);

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

}