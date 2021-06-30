let w = window.innerWidth;
let h = window.innerHeight;
let looper;
let testBut;

function preload() {
        
}


function setup() {
    createCanvas(w, h);

    looper = new Looper(200, 200, 100, 100);  //  here we go with the first looper object
    looper.init();  //  initialize button and recorder


}

function draw() {
    background(128, 128, 255);    //  draw background


}

