/**
 * Using p5.createButtons object to make html objects in the DOM
 * Because using the draw loop was potentially taxing the host server too much
 * 
 * We'll see if this fixes the problem
 */

class Buttons {
    constructor(
        parentButX,     //  parent effect button x-coordinate
        parentButY,    //  parent effect button y-coordinate
        parentButWidth,    //  parent effect button width
        parentButHeight, //    parent effect button height
        looper  //  this buttons instance's of looper
    ) {
        this.parentButX = parentButX;
        this.parentButY = parentButY;
        this.parentButWidth = parentButWidth;
        this.parentButHeight = parentButHeight;
        this.looper = looper;

        this.delayButX = parentButX;    //  keep track of specific effect button x-coordinates
        this.reverbButX = 0.75 * parentButX;
        this.ampModButX = 0.5 * parentButX;

        this.delayRouteIntoReverbActive = false;
        
        this.delayTimeLFO = new p5.Oscillator();
        this.delayTimeLFOActive = false;

        this.delayFilterLFO = new p5.Oscillator();
        this.delayFilterLFOActive = false;        
    }

    init() {    //  set up functions and objects that can only be called once
        this.delayTimeLFO.start();
        this.delayTimeLFO.disconnect();
        this.delayTimeLFO.scale(-1, 1, 0, 1);

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

        if (this.delayRouteIntoReverbActive) {  //  ---- route delay to reverb
            fill(0, 255, 0);
            circle((0.15 * this.parentButWidth) + this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle((0.15 * this.parentButWidth) + this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);
        }

        if (this.delayTimeLFOActive) {  //  ---- delay time LFO
            fill(0, 255, 0);
            circle((0.15 * this.parentButWidth) + 1.075 * this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle((0.15 * this.parentButWidth) + 1.075 * this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);
        }

        if (this.delayFilterLFOActive) {  //  ---- delay filter LFO
            fill(0, 255, 0);
            circle((0.15 * this.parentButWidth) + 1.15 * this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle((0.15 * this.parentButWidth) + 1.15 * this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);
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

    makeControlButtons() {
        // -------- ROUTE DELAY LOOP INTO REVERB -------- //
        this.delayRouteIntoReverbBut = createButton('ROUTE TO\nREVERB');    //  make button
        this.delayRouteIntoReverbBut.position(this.delayButX, this.parentButY + (1.1 * this.parentButHeight));    //  position
        this.delayRouteIntoReverbBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);   //  size
        this.delayRouteIntoReverbBut.mousePressed(() => {this.delayRouteIntoReverbProcess();});     //  start event to toggle routing

        // -------- DELAY TIME LFO -------- //
        this.delayTimeLFOBut = createButton('TIME \nLFO');  //  make button
        this.delayTimeLFOBut.position(1.075 * this.delayButX, this.parentButY + (1.1 * this.parentButHeight));    //  position
        this.delayTimeLFOBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);   //  size
        this.delayTimeLFOBut.mousePressed(() => {this.delayTimeLFOProcess();});     //  start event to trigger effect control

        // -------- DELAY FILTER LFO -------- //
        this.delayFilterLFOBut = createButton('FILTER LFO');    //  make button
        this.delayFilterLFOBut.position(1.15 * this.delayButX, this.parentButY + (1.1 * this.parentButHeight));    //  position
        this.delayFilterLFOBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight); //  size
        this.delayFilterLFOBut.mousePressed(() => {this.delayFilterLFOProcess();});     // start event to trigger effect control
    }

    delayRouteIntoReverbProcess() {
        if (!this.delayRouteIntoReverbActive) {
            this.looper.delay.connect(this.looper.reverbFor);  //  connect delay output to reverb node
            this.looper.reverbFor.drywet(1);

            this.delayRouteIntoReverbActive = true; //  flip boolean
        }
        else {
            this.looper.delay.disconnect(); //  disconnect delay from all outputs
            this.looper.delay.connect();    //  connect delay back to master output

            this.delayRouteIntoReverbActive = false;    //  flip boolean
        }
    }

    delayTimeLFOProcess() {     //  ----    delay time LFO
        if (!this.delayTimeLFOActive) {
            this.delayTimeLFO.freq(0.2);    //  set lfo to 0.2 Hz
            this.delayTimeLFO.amp(1);   //  all LFOs will be at amplitude of 1
            this.looper.delay.delayTime(this.delayTimeLFO); //  apply lfo to delay time

            this.delayTimeLFOActive = true;     //  flip boolean
        }
        else {
            this.delayTimeLFO.disconnect();     //  need to disconnect oscillator in order to get it off the delayTime param
            this.looper.delay.delayTime(0.5);   //  set delay time to a fixed amount

            this.delayTimeLFOActive = false;    //  flip boolean
        }
    }

    delayFilterLFOProcess() {   //  ----    delay filter LFO
        if (!this.delayFilterLFOActive) {
            this.delayFilterLFO.freq(2);    //  set lfo speed   
            this.delayFilterLFO.amp(1);     //  ensure all lfos are at full 'volume' to get full spread 
            this.looper.delay.filter(this.delayFilterLFO, 7.5); //  apply lfo directly to filter cutoff here, with a Q of 7.5

            this.delayFilterLFOActive = true;
        }
        else {
            this.looper.delay.filter(4500, 1);  //  change filter cutoff to a static amount

            this.delayFilterLFOActive = false;
        }
    }
}