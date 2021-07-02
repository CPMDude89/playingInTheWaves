/**
 * this is my custom work-around to the fact 
 * that p5 does not give the user direct access to oscillator output
 * 
 * Some p5 objects will accept an oscillator object directly as function arg,
 * but quite a few don't yet, this is the solution to that problem
 * 
 * Creates a p5.Oscillator object and a p5.FFT object. Runs the oscillator through the fft
 * and outputs the value of the first bin of the waveform() function
 */

class Analyzer {
    constructor(
        low,    //  scaled output low end
        high,   //  scaled output high end
    ) {
        this.osc = new p5.Oscillator('sine');   
        this.osc.start();
        this.osc.disconnect();
        this.osc.amp(1);

        this.fft = new p5.FFT();
        this.fft.setInput(this.osc);

        this.low = low;
        this.high = high;
    }

    setFreq(f) {    //  always call this before process()!!!!!
        this.osc.freq(f);   //  set oscillator frequency
    }
    process() {     //  call this in the draw loop
        let waveform = this.fft.waveform();     //  creates a snapshot of amplitude values along the time domain
        let val = map(waveform[0], -1, 1, this.low, this.high);    //  scales output to get out of negative range

        return val;
    }
}