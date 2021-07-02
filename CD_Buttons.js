/**
 * Class to create and control graphic buttons in the p5 draw loop
 */
class Buttons {
    //  constructor params
    constructor(    
        parentButX,     //  parent effect button x-coordinate
        parentButY,    //  parent effect button y-coordinate
        parentButWidth,    //  parent effect button width
        parentButHeight, //    parent effect button height
        looper  //  this buttons instance's of looper
    ) {
        //  definte class properties
        this.parentButX = parentButX;   //  apply user input to class-instance variables
        this.parentButY = parentButY;
        this.parentButWidth = parentButWidth;
        this.parentButHeight = parentButHeight;
        this.circleR = this.parentButHeight;
        this.looper = looper;

        this.delayButX = parentButX;    //  keep track of specific effect button x-coordinates
        this.reverbButX = 0.75 * parentButX;
        this.ampModButX = 0.5 * parentButX;
        
        this.delayFilterLFO = new p5.Oscillator();
        
        
        this.delayFilterLFOActive = false;
    }

    init() {
        this.delayFilterLFO.start();    //  start up LFO
        this.delayFilterLFO.disconnect();
        this.delayFilterLFO.scale(-1, 1, 10, 5000);
        
    }

    effButAlerts() {    //  draw signal circles to determine if effect is active: red == off, green == on
        if (this.looper.delayActive) {  //  ---- delay
            fill(0, 255, 0);
            circle(1.01 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle(1.01 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        if (this.looper.reverbActive) { //  ---- reverb
            fill(0, 255, 0);
            circle(.76 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle(.76 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        if (this.looper.ampModActive) { //  ---- amp mod
            fill(0, 255, 0);
            circle(.51 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle(.51 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
    }

    drawDelayParamControls(mX = 0, mY = 0) {
        let paramButX = 1.01 * this.parentButX;     //  set up coordinate variables for effect param control buttons
        let paramButY = this.parentButY + (1.6 * this.parentButHeight);
        textAlign(CENTER);  //  center label text with corresponding buttons
        textSize(20);
        

        // ---- if clicked inside the circle    
        let d = dist(mX, mY, paramButX, paramButY);
        if (d < this.circleR) {     //  if mouse clicked inside circle, toggle delay filter LFO active boolean
            this.delayFilterLFOActive ? this.delayFilterLFOActive = false : this.delayFilterLFOActive = true;
        }
        
        if (this.delayFilterLFOActive) {   //  if filter LFO is active, turn button green   
            fill(0, 255, 0);
            this.delayFilterLFO.freq(2);
            this.delayFilterLFO.amp(1);
            this.looper.delay.filter(this.delayFilterLFO, 8);
        }
        else {      //  if filter LFO is inactive, turn button red
            this.looper.delay.filter(4000, 1);
        }

        circle(paramButX, paramButY, this.circleR);
        fill(0);
        text('FILTER LFO', paramButX, paramButY + (1.1 * this.parentButHeight));


    }


}