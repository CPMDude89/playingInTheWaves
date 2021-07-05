let w = window.innerWidth;
let h = window.innerHeight;
let looper1, looper2, looper3, looper4, looper5;
let buttons1, buttons2, buttons3, buttons4, buttons5;
let recButX=(4 * w/5), recButY=(h/5), recButWidth=(w/10), recButHeight=(h/10);
let effectButtonX = 4.5 * (w/7);

function preload() {
        
}

function setup() {
    canv = createCanvas(w, h);

    looper1 = new Looper(recButX, recButY, recButWidth, recButHeight, effectButtonX);  
    buttons1 = new Buttons(looper1.getEffButX(), looper1.getEffButY(), looper1.getEffButWidth(), looper1.getEffButHeight(), looper1);
    looper1.init(buttons1);  //  initialize button and recorder
    buttons1.init();

    looper2 = new Looper(recButX, 2 * recButY, recButWidth, recButHeight, effectButtonX);
    buttons2 = new Buttons(looper2.getEffButX(), looper2.getEffButY(), looper2.getEffButWidth(), looper2.getEffButHeight(), looper2);
    looper2.init(buttons2);  //  initialize button and recorder
    buttons2.init();  
    
    looper3 = new Looper(recButX, 3 * recButY, recButWidth, recButHeight, effectButtonX);
    buttons3 = new Buttons(looper3.getEffButX(), looper3.getEffButY(), looper3.getEffButWidth(), looper3.getEffButHeight(), looper3);
    looper3.init(buttons3);
    buttons3.init();  

    looper4 = new Looper(recButX, 4 * recButY, recButWidth, recButHeight, effectButtonX);
    buttons4 = new Buttons(looper4.getEffButX(), looper4.getEffButY(), looper4.getEffButWidth(), looper4.getEffButHeight(), looper4);
    looper4.init(buttons4);  
    buttons4.init();
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
    

    fill(0, 179, 0);
    textSize(18);
    if (looper1.getState() > 1 ) {   //  once effect buttons are displayed
        buttons1.effButAlerts();    //  draw signal lights if to keep track of effect activity/inactivity

        if (looper1.ampModActive) {     //  print to screen the frequency value of the amp mod oscillator
            let val = looper1.ampModOsc.getFreq();
            fill(0);
            text(val + " Hz", 1.02 * buttons1.ampModButX, buttons1.parentButY + (3.5 * buttons1.parentButHeight));
        }
    }

    if (looper2.getState() > 1 ) {   //  once effect buttons are displayed
        buttons2.effButAlerts();    //  draw signal lights if to keep track of effect activity/inactivity

        if (looper2.ampModActive) {     //  print to screen the frequency value of the amp mod oscillator
            let val = looper2.ampModOsc.getFreq();
            fill(0);
            text(val + " Hz", 1.02 * buttons2.ampModButX, buttons2.parentButY + (3.5 * buttons2.parentButHeight));
        }
      
    }

    if (looper3.getState() > 1 ) {   //  once effect buttons are displayed
        buttons3.effButAlerts();    //  draw signal lights if to keep track of effect activity/inactivity

        if (looper3.ampModActive) {     //  print to screen the frequency value of the amp mod oscillator
            let val = looper3.ampModOsc.getFreq();
            fill(0);
            text(val + " Hz", 1.02 * buttons3.ampModButX, buttons3.parentButY + (3.5 * buttons3.parentButHeight));
        }
        
    }

    if (looper4.getState() > 1 ) {   //  once effect buttons are displayed
        buttons4.effButAlerts();    //  draw signal lights if to keep track of effect activity/inactivity

        if (looper4.ampModActive) {     //  print to screen the frequency value of the amp mod oscillator
            let val = looper4.ampModOsc.getFreq();
            fill(0);
            text(val + " Hz", 1.02 * buttons4.ampModButX, buttons4.parentButY + (3.5 * buttons4.parentButHeight));
        }
       
    }
}