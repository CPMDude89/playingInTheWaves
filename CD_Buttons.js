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
        
        this.delayTimeLFO = new p5.Oscillator();
        this.delayTimeLFOActive = false;
    }

    init() {
        this.delayFilterLFO.start();    //  start up LFO
        this.delayFilterLFO.disconnect();
        this.delayFilterLFO.scale(-1, 1, 10, 5000);

        this.delayTimeLFO.start();
        this.delayTimeLFO.disconnect();
        this.delayTimeLFO.scale(-1, 1, 0, 1);
        
    }

    // -------- GETTERS -------- //
    //get

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
        //  set up coordinate variables for effect param control buttons
        let delFiltLFOX = 1.01 * this.parentButX;   //  delay filter cutoff LFO
        let delTimeLFOX = 1.1 * this.parentButX;    //  delay time LFO
        let butY = this.parentButY + (1.6 * this.parentButHeight);  //  all these buttons will have the same y-coordinate

        textAlign(CENTER);  //  center label text with corresponding buttons
        textSize(15);
        
        //  ---- DELAY FILTER LFO ---- //
        let d = dist(mX, mY, delFiltLFOX, butY);
        if (d < this.circleR) {     //  if mouse clicked inside circle, toggle delay filter LFO active boolean
            this.delayFilterLFOActive ? this.delayFilterLFOActive = false : this.delayFilterLFOActive = true;
        }
        
        if (this.delayFilterLFOActive) {   //  if filter LFO is active, turn button green, activate lfo to filter cutoff  
            fill(0, 255, 0);    //  green
            
            this.delayFilterLFO.freq(2);    //  set lfo speed   
            this.delayFilterLFO.amp(1);     //  ensure all lfos are at full 'volume' to get full spread 
            this.looper.delay.filter(this.delayFilterLFO, 7.5); //  apply lfo directly to filter cutoff here, with a Q of 7.5
        }
        else {      //  if filter LFO is inactive, turn button red
            fill(255, 0, 0);    //  red

            this.looper.delay.filter(4500, 1);  //  change filter cutoff to a static amount
        }
        circle(delFiltLFOX, butY, this.circleR);    //  draw button

        // ---- DELAY TIME LFO ---- //
        d = dist(mX, mY, delTimeLFOX, butY);
        if (d < this.circleR) {     //  if mouse clicked inside circle, toggle delay filter LFO active boolean
            this.delayTimeLFOActive ? this.delayTimeLFOActive = false : this.delayTimeLFOActive = true;
        }

        if (this.delayTimeLFOActive) {   //  if filter LFO is active, turn button green, activate lfo to filter cutoff  
            fill(0, 255, 0);    //  green

            this.delayTimeLFO.freq(0.2);    //  set lfo to 0.2 Hz
            this.delayTimeLFO.amp(1);   //  all LFOs will be at amplitude of 1
            this.looper.delay.delayTime(this.delayTimeLFO); //  apply lfo to delay time

        }
        else {      //  if filter LFO is inactive, turn button red
            fill(255, 0, 0);    //  red

            this.delayTimeLFO.disconnect();     //  need to disconnect oscillator in order to get it off the delayTime param
            this.looper.delay.delayTime(0.5);   //  set delay time to a fixed amount
        }
        circle(delTimeLFOX, butY, this.circleR);    //  draw button
        
        fill(0);    //  black for text
        text('FILTER\nLFO', delFiltLFOX, butY + (1.1 * this.parentButHeight));
        text('DELAY TIME\nLFO', delTimeLFOX, butY + (1.1 * this.parentButHeight));


    }


}