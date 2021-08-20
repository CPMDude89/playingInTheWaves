# *Playing In The Waves: A Play-Based Approach to Web Audio*

Welcome to *Playing In the Waves*! This website was built as the practical component to my masters dissertation to receive an MSc in Sound Design at University of Edinburgh, 2021. 

This project is an exploration into two main areas: 

-   Learning about sound through play 
-   and getting audio software to run in the browser

Each component of *Playing In The Waves* will attempt both educate the user through playful science communication and provide a set of tools to easily create interesting sounds. That being said, there are two main halves of this website to each focus on one or the either above stated goals. 

If you are NEW to sound design concepts, music production, or technology in general: please take the [Tour](https://cpmdude89.github.io/playingInTheWaves/TourPlayRate.html). The *Tour* is designed to be engaging and fun, while letting the user learn through experimentation. Each stop on the *Tour* has a simple, intuitive interface and focuses on a single aspect of digital audio. This functions as the primary education component of *Playing In The Waves*.

If you are more experienced with audio software, or just want to jump into a set of tools and play around, head to the [Playground](https://cpmdude89.github.io/playingInTheWaves/PITW_Playground.html). Here you can experiment with 3-tracks and their independent set of effects. You can connect an effect parameter (like a delay's delay-time for example) to the mouse's position on screen and wave it around to hear the effects in motion. Go nuts! Read more about how the whole system works in the *Playground* explainer file.

If you are accessing this website on a smart phone, please check out the [Phone Version](https://cpmdude89.github.io/playingInTheWaves/PITW_phoneVersion.html). I am new to web development in general and struggled to make everything scale appropriately to a vertical phone screen instead of a horizontal computer screen. In the future I hope to learn how to do this, but for now I have provided a version that will scale nicely to a phone screen's dimensions. 

Lastly, when in doubt, click on the page title!

## Notes on Platform Performance

*Playing In The Waves* works best on Google Chrome across all devices. Mozilla Firefox is a close second in terms of performance. All other browsers will not let you record audio into the website directly.

If you are viewing this on an Android phone, sometimes recording and playing back the recorded audio won't work right away. This can be fixed by loading a pre-loaded stock sample from one of the 'SAMPLE' buttons, then pressing 'START OVER', and THEN recording with the record button. 

When in doubt, REFRESH! This is a student project and might not always do exactly what you want it to. A simple page refresh usually solves all issues. 

## Acknowledgements

The visuals of each page is coded entirely in [p5.js](https://p5js.org/), and the audio is done with [Tone.js](https://tonejs.github.io/).

A huge thank you to Carla Sayer for providing original poetry and for Martina Maclachlan for providing sung vocals throughout this project. 

# readme

This project is held together by p5.js, a JavaScript library created by [The Processing Foundation](https://p5js.org/) and [Tone.js](https://tonejs.github.io/), a JavaScript audio library made by Yotam Mann

## My favorite sources for learning about Web Audio

- [p5.sound reference](https://p5js.org/reference/#/libraries/p5.sound)
- [Tone.js API](https://tonejs.github.io/docs/14.7.77/index.html)
- [The Coding Train Sound Playlist](https://www.youtube.com/watch?v=Pn1g1wjxl_0&list=PLRqwX-V7Uu6aFcVjlDAkkGIixw70s7jpW&ab_channel=TheCodingTrain)
- [David Bouchard's Channel](https://www.youtube.com/watch?v=ddVrGY1dveY&t=2093s&ab_channel=DavidBouchard)
- [Browser Noise by Dan Trempte](https://www.youtube.com/watch?v=8u1aQdG5Nrk&ab_channel=TheAudioProgrammer)

## PITW_Classes_Tone.js

This is file contains all of my classes derived from p5.js and Tone.js objects. 

- `SamplerButton`
  - This is the main way to record and handle playback audio from the user. It takes positional and size arguments for the button on the canvas. 
- `ForwardsAndBackwardsSamplerButton`
  - A child class of the `SamplerButton`
  - Used for [Tour: Play Rate](https://cpmdude89.github.io/playingInTheWaves/TourPlayRate.html) to handle reverse play back
- `PageRecorder`
  - Will record audio output from the page, then download to user's computer in a .webm file
  - Takes same size and positional arguments above two classes do
- `GranulationSlicer`
  - A failed attempt of having multiple slicers in [Tour: Audio Slicing](https://cpmdude89.github.io/playingInTheWaves/TourAudioSlicer.html)
  - It works, but the user interface moves jankily and glitches. I suspect it just takes too much processing power to pull off my inefficient code
- `OscScope`
  - Main waveform visualizer window
  - Takes positional and size arguments, as well as bins amount for waveform and fft modes and a boolean for shaping the window as a square or rectangle
  - Largely based off [this tutorial by David Bouchard](https://www.youtube.com/watch?v=ddVrGY1dveY&t=1404s&ab_channel=DavidBouchard)
- `LFOVisualizer`
  - Visualizer to show current phase of an LFO
  - Found in [Tour: Amp Mod](https://cpmdude89.github.io/playingInTheWaves/TourAmpMod.html) and [Tour: Delay](https://cpmdude89.github.io/playingInTheWaves/TourDelay.html)
  - Takes positional and size arguments for vertical track, as well as r, g, b values for the ball
- `PhoneControls`
  - This is the [Phone Version](https://cpmdude89.github.io/playingInTheWaves/PITW_phoneVersion.html)'s track effect rack. 
  - Takes positional and size arguments based on the `SamplerButton` it's connected to. Then it bases its own buttons off that
  - Takes in the `SamplerButton`'s `Tone.Player` and `Volume` as well. This means each track has an independent set of effects
- `PlaygroundControls`
  - Takes positional and size arguments based on the `SamplerButton` it's connected to. Then it bases its own buttons off that
  - Takes in the `SamplerButton`'s `Tone.Player` and `Volume`, main script's `Reverb`, and track default `AutoFilter` frequency as well. This means each track has an independent set of effects
  - Handles effect parameter mouse tracking through the `checkForActivity()` function
  - I'm sorry this class is so long. 
- `SignalCircle`
  - This class is used to show an objects active or recording status
  - Takes 2 positional arguments and one ball size argument
  - Used by almost every other class here
  - Was originally made because I didn't realize that p5.js has a [style() function](https://p5js.org/reference/#/p5.Element/style) to change button color (now implemented in the *Phone Version*!)
    - Then was used as an integral part of the *Playground* to trigger and track the effect parameter mouse tracking. Sometimes things just work out
