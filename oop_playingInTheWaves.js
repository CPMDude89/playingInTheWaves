let w = window.innerWidth;
let h = window.innerHeight;
let looper1, looper2, looper3, looper4, looper5;
let buttons1, buttons2, buttons3, buttons4, buttons5;
let recButX=(4 * w/5), recButY=(h/6), recButWidth=(w/10), recButHeight=(h/10);
let effectButtonX = 4.5 * (w/7);
let drawBool = false;

function preload() {
        
}

function setup() {
    canv = createCanvas(w, h);

    looper1 = new Looper(recButX, recButY, recButWidth, recButHeight, effectButtonX);  
    buttons1 = new Buttons(looper1.getEffButX(), looper1.getEffButY(), looper1.getEffButWidth(), looper1.getEffButHeight(), looper1);
    looper1.init(buttons1);  //  initialize button and recorder
    buttons1.init();

    looper2 = new Looper(recButX, 2 * recButY, recButWidth, recButHeight, effectButtonX);
    looper2.init();  

    looper3 = new Looper(recButX, 3 * recButY, recButWidth, recButHeight, effectButtonX);
    looper3.init();  

    looper4 = new Looper(recButX, 4 * recButY, recButWidth, recButHeight, effectButtonX);
    looper4.init();  

    looper5 = new Looper(recButX, 5 * recButY, recButWidth, recButHeight, effectButtonX);
    looper5.init();  
}

function draw() {
    canv.background(128, 128, 255);    //  draw background

    fill(0);
    textAlign(CENTER);  //  page title
    textSize(45);
    text('Playing In The Waves: A Play-Based Approach to Generative Sound Design', w/2, h/11);

    textAlign(LEFT);    //  set up track names
    textSize(28);
    text('Track 1', recButX, (recButY - (0.01 * recButY))); //  track names 1-5
    text('Track 2', recButX, (2*recButY - (0.01 * 2 * recButY)));
    text('Track 3', recButX, (3*recButY - (0.01 * 3 * recButY)));
    text('Track 4', recButX, (4*recButY - (0.01 * 4 * recButY)));
    text('Track 5', recButX, (5*recButY - (0.01 * 5 * recButY)));

    fill(0, 179, 0);

    if (looper1.getState() > 1) {   //  once effect buttons are displayed
        buttons1.effButAlerts();    //  draw signal lights if to keep track of effect activity/inactivity
 
        buttons1.drawDelayParamControls();     //  control delay filter LFO
        canv.mousePressed(function() {buttons1.drawDelayParamControls(mouseX, mouseY);});
        
    }

}

