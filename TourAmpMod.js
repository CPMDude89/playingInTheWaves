/**
 * A part of Playing In The Waves' 'Tour'
 * This program will take in the user's input, and store it in a new audio buffer. 
 * Then it can be played back, and the amplitude of buffer playback will be attached to a p5.Oscillator
 * The 
 */

let w = window.innerWidth;
let h = window.innerHeight;
let mic, recorder, soundFile;
let recorderButton, recButWidth, recButHeight, recButX, recButY;
let state = 0;
