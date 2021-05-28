var song;
var button; 

function setup() {
    createCanvas(400, 400);
    song = loadSound("sounds/mothership.mp3", loaded);
    button = createButton("Play");
    button.mousePressed(togglePlaying);
    slider = createSlider(0, 1, 0.5, 0.01);
}

function togglePlaying() {
    if (!song.isPlaying()) {
        song.play();
        button.html("Pause");
    } 
    else {
         song.pause();
         button.html("Play");
    }
    
}

function loaded() {
    console.log("Loaded!");
}

function draw() {
background(320, 0 , 100);
fill(100);

song.setVolume(slider.value());

rect(mouseX, mouseY, 399, 399);

}