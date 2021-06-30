let w = window.innerWidth;
let h = window.innerHeight;
let looper1, looper2, looper3, looper4, looper5;
let recButX=(4 * w/5), recButY=(h/6), recButWidth=(w/10), recButHeight=(h/10);

function preload() {
        
}


function setup() {
    createCanvas(w, h);

    looper1 = new Looper(recButX, recButY, recButWidth, recButHeight);  //  here we go with the first looper object
    looper1.init();  //  initialize button and recorder

    looper2 = new Looper(recButX, 2 * recButY, recButWidth, recButHeight);
    looper2.init();  //  initialize button and recorder

    looper3 = new Looper(recButX, 3 * recButY, recButWidth, recButHeight);
    looper3.init();  //  initialize button and recorder

    looper4 = new Looper(recButX, 4 * recButY, recButWidth, recButHeight);
    looper4.init();  //  initialize button and recorder

    looper5 = new Looper(recButX, 5 * recButY, recButWidth, recButHeight);
    looper5.init();  //  initialize button and recorder
}

function draw() {
    background(128, 128, 255);    //  draw background

    textAlign(CENTER);  //  title
    textSize(45);
    text('Playing In The Waves: A Play-Based Approach to Generative Sound Design', w/2, h/11);

    textAlign(LEFT);    //  name of track 1
    textSize(28);
    text('Track 1', recButX, (recButY - (0.01 * recButY)));
    text('Track 2', recButX, (2*recButY - (0.01 * 2 * recButY)));
    text('Track 3', recButX, (3*recButY - (0.01 * 3 * recButY)));
    text('Track 4', recButX, (4*recButY - (0.01 * 4 * recButY)));
    text('Track 5', recButX, (5*recButY - (0.01 * 5 * recButY)));

}

