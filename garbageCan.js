
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

        // -------- REVERB AMP MOD -------- //
        this.reverbAmpModBut = createButton('AMP\nMOD');    //  make button
        this.reverbAmpModBut.position(1.2 * this.reverbButX, this.parentButY + (1.1 * this.parentButHeight));
        this.reverbAmpModBut.size(0.3 * this.parentButWidth, 1.8 * this.parentButHeight);
        this.reverbAmpModBut.mousePressed(() => {this.reverbAmpModProcess();}); 

        reverbAmpModProcess() {
        this.reverbAmpModActive ? (this.reverbAmpModActive = false) : (this.reverbAmpModActive = true);

        console.log(this.reverbAmpModActive);
    }

     /*
        if (buttons1.reverbAmpModActive) {      //  if button pressed, 
            //  apply amp mod to either forwards or backwards reverb
            //buttons1.reverbBackwardsActive ? looper1.reverbBack.amp(level) : looper1.reverbFor.amp(level);
        }
        */
         /*
        if (buttons2.reverbAmpModActive) {      //  if button pressed, 
            //  apply amp mod to either forwards or backwards reverb
            //buttons2.reverbBackwardsActive ? looper2.reverbBack.amp(level) : looper2.reverbFor.amp(level);  
        }
        */

        /*
        if (buttons3.reverbAmpModActive) {      //  if button pressed, 
           //  apply amp mod to either forwards or backwards reverb
            //buttons3.reverbBackwardsActive ? looper3.reverbBack.amp(level) : looper3.reverbFor.amp(level);
        }
        */

         /*
        if (buttons4.reverbAmpModActive) {      //  if button pressed, 
            //  apply amp mod to either forwards or backwards reverb
            //buttons4.reverbBackwardsActive ? looper4.reverbBack.amp(level) : looper4.reverbFor.amp(level);
        }
        */

        /*
        if (buttons5.reverbAmpModActive) {      //  if button pressed, 
            //  apply amp mod to either forwards or backwards reverb
            //buttons5.reverbBackwardsActive ? looper5.reverbBack.amp(level) : looper5.reverbFor.amp(level);
        }

        //  this line was taken out of every if statement below, because it was glitching the audio. Better if called only once per draw() cycle
        let level = reverbAmpModer.process();  //   fill variable with output of Analyzer() for reverb amp mod

        //  reverb amp mod
        this.reverbAmpModActive ? this.reverbAmpModSignal.drawActiveCircle() : this.reverbAmpModSignal.drawInactiveCircle(); 
        */





        /*
        */