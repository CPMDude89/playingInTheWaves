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

        //  delay, reverb, amp mod signal circles
        this.delaySignal = new SignalCircle(1.01 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        this.reverbSignal = new SignalCircle(.76 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        this.ampModSignal = new SignalCircle(.51 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);

        this.delayRouteIntoReverbActive = false;
        this.routeDelToVerbSignal = new SignalCircle((0.15 * this.parentButWidth) + this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);
        
        this.delayTimeLFO = new p5.Oscillator();
        this.delayTimeLFOActive = false;
        this.delayTimeLFOSignal = new SignalCircle((0.15 * this.parentButWidth) + 1.075 * this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);

        this.delayFilterLFO = new p5.Oscillator();
        this.delayFilterLFOActive = false;        
        this.delayFilterLFOSignal = new SignalCircle((0.15 * this.parentButWidth) + 1.15 * this.delayButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);

        this.reverbBackwardsActive = false;
        this.reverbBackwardsSignal = new SignalCircle((0.15 * this.parentButWidth) + this.reverbButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);

        this.reverbLongTailActive = false;
        this.reverbLongTailSignal = new SignalCircle((0.15 * this.parentButWidth) + 1.1 * this.reverbButX, (3.35 * this.parentButHeight) + this.parentButY, 0.7 * this.parentButHeight);


        //this.reverbLFO = new Analyzer(1, 100);
        //this.reverbLFO = new p5.Oscillator();
        //this.reverbLFOActive = false;
    }

    init() {    //  set up functions and objects that can only be called once
        this.delayTimeLFO.start();
        this.delayTimeLFO.disconnect();
        this.delayTimeLFO.scale(-1, 1, 0, 1);

        this.delayFilterLFO.start();    //  start up LFO
        this.delayFilterLFO.disconnect();
        this.delayFilterLFO.scale(-1, 1, 10, 5000);

        //this.reverbLFO.start();
        //this.reverbLFO.disconnect();
        //this.reverbLFO.scale(-1, 1, 0, 1);
        
        //this.reverbLFO.setFreq(0.3);
    }

    effButAlerts() {    //  draw signal circles to determine if effect is active: red == off, green == on
        //  delay
        this.looper.delayActive ? this.delaySignal.drawActiveCircle() : this.delaySignal.drawInactiveCircle();

        // route delay to reverb
        this.delayRouteIntoReverbActive ? this.routeDelToVerbSignal.drawActiveCircle() : this.routeDelToVerbSignal.drawInactiveCircle();
      
        //  delay time LFO
        this.delayTimeLFOActive ? this.delayTimeLFOSignal.drawActiveCircle() : this.delayTimeLFOSignal.drawInactiveCircle();

        //  delay filter LFO
        this.delayFilterLFOActive ? this.delayFilterLFOSignal.drawActiveCircle() : this.delayFilterLFOSignal.drawInactiveCircle();
        
        //  reverb
        this.looper.reverbActive ? this.reverbSignal.drawActiveCircle() : this.reverbSignal.drawInactiveCircle();

        //  reverse reverb
        this.reverbBackwardsActive ? this.reverbBackwardsSignal.drawActiveCircle() : this.reverbBackwardsSignal.drawInactiveCircle();

        //  reverb long tail
        this.reverbLongTailActive ? this.reverbLongTailSignal.drawActiveCircle() : this.reverbLongTailSignal.drawInactiveCircle();
            
        //  amp mod
        this.looper.ampModActive ? this.ampModSignal.drawActiveCircle() : this.ampModSignal.drawInactiveCircle();
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

        // -------- REVERB BACKWARDS -------- //
        this.reverbBackwardsBut = createButton('REVERSE\nREVERB');    //  make button
        this.reverbBackwardsBut.position(this.reverbButX, this.parentButY + (1.1 * this.parentButHeight));  //  position
        this.reverbBackwardsBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);
        this.reverbBackwardsBut.mousePressed(() => {this.reverbBackwardsProcess();});   //  switch reverbFor and reverbBack volumes

        // -------- REVERB LONG TAIL -------- //
        this.reverbLongTailBut = createButton('LONG\nTAIL');    //  make button
        this.reverbLongTailBut.position(1.1 * this.reverbButX, this.parentButY + (1.1 * this.parentButHeight));   //  position
        this.reverbLongTailBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight); //  size
        this.reverbLongTailBut.mousePressed(() => {this.reverbLongTailProcess();}); //  set reverb with a long reverb time

    }

    delayRouteIntoReverbProcess() {
        if (!this.delayRouteIntoReverbActive) {
            this.looper.delay.connect(this.looper.reverbFor);  //  connect delay output to forward reverb node
            this.looper.delay.connect(this.looper.reverbBack);  //  connect delay output to backward reverb node
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

    reverbBackwardsProcess() {
        if (!this.reverbBackwardsActive) {
            this.looper.reverbFor.drywet(0);    //  turn down forwards reverb
            this.looper.reverbBack.drywet(1);   //  turn up backwards reverb

            this.reverbBackwardsActive = true;
        }
        else {
            this.looper.reverbFor.drywet(1);    //  turn up forwards reverb
            this.looper.reverbBack.drywet(0);   //  turn down backwards reverb

            this.reverbBackwardsActive = false;
        }
    }

    reverbLongTailProcess() {
        if (!this.reverbLongTailActive) {
            this.looper.reverbFor.set(10, 2, false);    
            this.looper.reverbBack.set(10, 2, true);

            this.reverbLongTailActive = true;
        }
        else {
            this.looper.reverbFor.set(3, 2, false);
            this.looper.reverbBack.set(3, 2, true);

            this.reverbLongTailActive = false;
        }
    }
}





// -------- REVERB LFO -------- //
        /*

        // -------- REVERB ROUTE INTO DELAY -------- //
        this.reverbRouteIntoDelayBut = createButton('ROUTE TO\nDELAY');
        this.reverbRouteIntoDelayBut.position(1.2 * this.reverbButX, this.parentButY + (1.1 * this.parentButHeight));
        this.reverbRouteIntoDelayBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);
        this.reverbRouteIntoDelayBut.mousePressed(() => {this.reverbRouteIntoDelayProcess();});

        this.reverbLFOBut = createButton('REVERB\nLFO');
        this.reverbLFOBut.position(1.1 * this.reverbButX, this.parentButY + (1.1 * this.parentButHeight));
        this.reverbLFOBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);
        this.reverbLFOBut.mousePressed(() => {this.reverbLFOProcess();});   //  not sure yet
        

        reverbLFOProcess() {
            this.reverbLFO.freq(2);
            this.reverbLFO.amp(1);
    
            //this.looper.reverbFor.amp(this.reverbLFO);
        }
        */