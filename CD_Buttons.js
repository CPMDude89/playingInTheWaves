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
        this.looper = looper;

        this.delayButX = parentButX;
        this.reverbButX = 0.75 * parentButX;
        this.ampModButX = 0.5 * parentButX;
        
        this.circleX = 300;
        this.circleY = 300;
        this.circleR = 100;
    }

    drawCircle() {  //  draw test button
        circle(this.circleX, this.circleY, this.circleR);
    } 

    changeFeedbackAmt(mX, mY) {   //  make delay's feedback 0.1
        let d = dist(mX, mY, this.circleX, this.circleY);

        if (d < this.circleR) {     //  if mouse is inside circle when clicked
            console.log('BUTTON PRESSED');

            this.looper.delay.connect(this.looper.reverbFor);
        }
        else {
            console.log('OUTSIDE OF BUTTON PRESSED');

            this.looper.delay.disconnect();
            this.looper.delay.connect();
        }
    }

    effButAlerts() {    //  draw signal circles to determine if effect is active: red == off, green == on
        if (this.looper.delayActive) {  //  delay
            fill(0, 255, 0);
            circle(1.01 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle(1.01 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }

        if (this.looper.reverbActive) { //  reverb
            fill(0, 255, 0);
            circle(.76 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle(.76 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }

        if (this.looper.ampModActive) { //  amp mod
            fill(0, 255, 0);
            circle(.51 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
        else {
            fill(255, 0, 0);
            circle(.51 * this.parentButX, this.parentButY - (0.6 * this.parentButHeight), this.parentButHeight);
        }
    }



}