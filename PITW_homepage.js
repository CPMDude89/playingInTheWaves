/**
 * Here is the homepage for Playing In The Waves: A Play-Based Approach To Web Audio!
 * 
 * This page will link to the Tour, the Playground, the phone version, the web editor, the GitHub, and the blog.
 */

let w=window.innerWidth, h=window.innerHeight;
let tour, playground, phone, youtube, github, blog;

function setup() {
    createCanvas(w, h);

    tour = createA("https://cpmdude89.github.io/playingInTheWaves/TourPlayRate.html", 'Take the TOUR!');
    tour.position(0.15 * w, 0.34 * h);
    tour.style('font-size', '3vw');

    playground = createA('https://cpmdude89.github.io/playingInTheWaves/PITW_Playground.html', 'Go to the Playground!');
    playground.position(w * 0.62, h * 0.34);
    playground.style('font-size', '3vw');

    phone = createA("https://cpmdude89.github.io/playingInTheWaves/PITW_phoneVersion.html", 'Phone Version!');
    phone.position(w * 0.38, h * 0.69);
    phone.style('font-size', '4vw');

    youtube = createA("https://www.youtube.com/channel/UClRR2mCXVIIttDq9P1NE7iA", 'YouTube');
    youtube.position(w * 0.1, h * 0.85);
    youtube.style('font-size', '3vw');

    github = createA("https://github.com/CPMDude89/playingInTheWaves", 'GitHub');
    github.position(w * 0.45, h * 0.85);
    github.style('font-size', '3vw');

    blog = createA("https://chrisduvallmusic.com/2021/05/20/beginning/", 'Blog');
    blog.position(w * 0.8, h * 0.85);
    blog.style('font-size', '3vw');
}

function draw() {
    textOutput();
    background(255);
    
    noStroke();
    fill(112, 219, 120);    //  top left background rect: Tour 
    rect(0, 0, w * 0.5, h * 0.6);

    fill(71, 209, 80);      //  top right background rect: Playground
    rect(w * 0.5, 0, w * 0.5, h * 0.6);

    fill(0, 150, 80);       //  middle background rect: Phone Version
    rect(0, h * 0.6, w, h * 0.2);

    fill(153, 255, 255);    //  bottom background rect: Github/Blog
    rect(0, h * 0.8, w, h * 0.2);

    noStroke();
    textAlign(CENTER);
    fill(0);
    textSize(w * 0.03);
    textStyle(BOLD);
    text('Playing In The Waves:\nA Play-Based Approach to Web Audio', 0.5 * w, 0.08 * h);    

    textSize(w * 0.03)
    textStyle(NORMAL)
    text('New to Sound Design?', w * 0.25, h * 0.3);

    text('Ready to Jump Right In?', w * 0.75, h * 0.3);

    text('On a Mobile Device?', w * 0.5, h * 0.65)

}