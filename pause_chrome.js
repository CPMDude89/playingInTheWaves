let soundFile;
let mili_timer;
let fileDuration;
let startTime;
let curTime;
let firstTimePlay = false;


function preload()
{
    soundFormats('ogg', 'mp3');
    soundFile = loadSound('sounds/sci_fi_test_sound.mp3');
}

function setup()
{
    fileDuration = soundFile.duration();
    let canv = createCanvas(300, 300);
    canv.mouseOver(canvasPressed);
    canv.mouseOut(canvasReleased);
    background(120);
    text('Press to play, release to pause', 50, 20, width, height);
}

function canvasPressed()
{
    if (!firstTimePlay)
    {
        startTime = mili_timer;
        firstTimePlay = true;
    }
    else
    {
        startTime = mili_timer - curTime;
    }
    
    //  green background
    background(0, 255, 0);
    text('Press to play, release to pause, ', 50, 20, width, height);
    
    soundFile.loop();
    soundFile.jump(scaleCurTime((curTime / 1000)));
}

function canvasReleased()
{
    //  red background
    background(255, 0, 0);
    text('Press to play, release to pause', 50, 20, width, height);

    soundFile.pause();

    curTime = mili_timer - startTime;
}

function scaleCurTime(ct)
{
    if (ct >= fileDuration)
    {
        while (ct >= fileDuration)
        {
            ct -= fileDuration;
        }
    }
    return ct;
}

function draw()
{
    mili_timer = millis();
}