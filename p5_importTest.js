let w = window.innerWidth;
let h = window.innerHeight;
let looper;
let testBut;

function preload() {
        
}


function setup() {
    createCanvas(w, h);
    
    testBut = createButton('TEST PLAY');
    testBut.position(300, 300);
    testBut.size(200, 200);

    looper = new Looper(200, 200, 100);  //  here we go with the first looper object
    looper.init();

    //testBut.mousePressed(looper.playOsc);
}

function draw() {

    

    background(150);
}

function beginOsc() {
    //looper.osc.start();
}