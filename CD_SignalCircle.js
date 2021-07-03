/**
 * Draws a red or a green circle if an effect is active or not
 */

class SignalCircle {
    constructor(
        x_coordinate,
        y_coordinate,
        radius
    ) {
        this.x_coordinate = x_coordinate;
        this.y_coordinate = y_coordinate;
        this.radius = radius;
    }

    drawActiveCircle() {    //  if the effect is active
        fill(0, 255, 0);    //  green

        circle(this.x_coordinate, this.y_coordinate, this.radius);  //  draw circle
    }

    drawInactiveCircle() {    //  if the effect is active
        fill(255, 0, 0);    //  green

        circle(this.x_coordinate, this.y_coordinate, this.radius);  //  draw circle
    }
}