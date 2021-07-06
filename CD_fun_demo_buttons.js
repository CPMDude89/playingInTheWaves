/**
 * Using p5.createButtons object to make html objects in the DOM
 * Because using the draw loop was potentially taxing the host server too much
 * 
 * We'll see if this fixes the problem
 */

 class FunButtons {
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
        this.ampModButX = 0.5 * parentButX;

        //  delay, amp mod signal circles
        this.delaySignal = new SignalCircle(1.01 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        this.ampModSignal = new SignalCircle(.51 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);

        this.delayTimeLFO = new p5.Oscillator();

        this.delayFilterLFO = new p5.Oscillator();
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
        //  delay
        this.looper.delayActive ? this.delaySignal.drawActiveCircle() : this.delaySignal.drawInactiveCircle();
            
        //  amp mod
        this.looper.ampModActive ? this.ampModSignal.drawActiveCircle() : this.ampModSignal.drawInactiveCircle();
    }

    delayTimeLFOProcess() {     //  ----    delay time LFO
        if (this.looper.delayActive) {  //  only trigger if delay is already going
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
    }

    delayFilterLFOProcess() {   //  ----    delay filter LFO
        if (this.looper.delayActive) {  //  only trigger if delay is already going
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

    ampModNewFreqProcess() {
        if (this.looper.ampModActive) {
            this.looper.ampModOsc.freq(Math.round(random(100)));    //  send new random freq into amp mod osc

            if (this.ampModFreqLFOActive) {     //  if amp mod frequency LFO is active, reset the LFO modulating that frequency
                this.ampModFreqLFO = new p5.Oscillator();
                this.ampModFreqLFO.start();
                this.ampModFreqLFO.disconnect();
                this.ampModFreqLFO.scale(-1, 1, random() * this.looper.ampModOsc.getFreq(), (1 + random()) * this.looper.ampModOsc.getFreq());
                this.ampModFreqLFO.amp(1);
                this.ampModFreqLFO.freq(random(2));

                this.looper.ampModOsc.freq(this.ampModFreqLFO);
            }
        }
    }

    ampModFreqLFOProcess() {    //  apply LFO output to the amp mod oscillator
        if (this.looper.ampModActive) {
            if (!this.ampModFreqLFOActive) {    //  because .scale() can't be called more than once per sketch, 
                this.ampModFreqLFO = new p5.Oscillator();   //  have to create a new p5.Oscillator every time user wants to change the frequency
                this.ampModFreqLFO.start();
                this.ampModFreqLFO.disconnect();
                this.ampModFreqLFO.scale(-1, 1, random() * this.looper.ampModOsc.getFreq(), (1 + random()) * this.looper.ampModOsc.getFreq());
                this.ampModFreqLFO.amp(1);
                this.ampModFreqLFO.freq(random(2));

                this.looper.ampModOsc.freq(this.ampModFreqLFO);     //  apply LFO output to carrier amp mod oscillator

                this.ampModFreqLFOActive = true;
            }
            else {
                this.looper.ampModOsc.freq(Math.round(random(20)));

                this.ampModFreqLFOActive = false;
            }
        }
    }

    ampModNewDepthProcess() {   //  change amp mod LFO depth (oscillator amplitude)
        if (this.looper.ampModActive) {
            this.looper.ampModOsc.amp(random());
        }
    }
}





