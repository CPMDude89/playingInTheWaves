/**
 * Here is the homepage for Playing In The Waves: A Play-Based Approach To Web Audio!
 * 
 * This page will link to the Tour, the Playground, the phone version, the web editor, the GitHub, and the blog.
 */

let w=window.innerWidth, h=window.innerHeight;
let tour;

function setup() {
    createCanvas(w, h);

    tour = createA("https://cpmdude89.github.io/playingInTheWaves/TourPlayRate.html", 'Take the TOUR!');
    tour.position(0.5 * w, 0.5 * h);
    tour.style('font-size', '50px');
    tour.style('text-align', 'center');
}

function draw() {
    background(255);
    
    noStroke();
    fill(112, 219, 112);
    rect(0, 0, w * 0.33, h * 0.8);

    fill(71, 209, 71);
    rect(w * 0.33, 0, w * 0.34, h * 0.8);

    fill(46, 184, 46);
    rect(w * 0.67, 0, w * 0.33, h * 0.8);

    fill(0);
    rect(0, h * 0.8, w, h * 0.2);

    noStroke();
    textAlign(CENTER);
    fill(0);
    textSize(40);
    text('Playing In The Waves: A Play-Based Approach to Web Audio', 0.5 * w, 0.1 * h);    

    textSize(20)


}