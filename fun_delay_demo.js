let w = window.innerWidth, h = window.innerHeight;
let looper1, looper2;
let buttons1, buttons2;
let inMic;
let bigButX=(2 * (w/3)), bigButY=(h/4), bigButWidth=(w/5), bigButHeight=(h/5);
let effectButtonX = 4.5 * (w/7);

function setup() {
    canv = createCanvas(w, h);
    inMic = new p5.AudioIn();

    looper1 = new Looper(bigButX, bigButY, bigButWidth, bigButHeight, effectButtonX, inMic);  
    buttons1 = new FunButtons(looper1.getEffButX(), looper1.getEffButY(), looper1.getEffButWidth(), looper1.getEffButHeight(), looper1);
    looper1.init(buttons1);  //  initialize button and recorder
    buttons1.init();

    looper2 = new Looper(bigButX, 2 * bigButY, bigButWidth, bigButHeight, effectButtonX, inMic);
    buttons2 = new FunButtons(looper2.getEffButX(), looper2.getEffButY(), looper2.getEffButWidth(), looper2.getEffButHeight(), looper2);
    looper2.init(buttons2);  //  initialize button and recorder
    buttons2.init();

    
}

function draw() {
    background(50, 200, 10);

}

