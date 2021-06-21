# p5 functions browser-by-browser 

## p5.SoundFile
| Function | Chrome | Firefox | Safari |
| -------- | ------ | ------- | ------ |
| isLoaded() | yes | yes  | yes |
| play() | yes | yes | yes |
| pause() | no: acts like stop() | yes | yes |
| loop() | yes | yes | yes |
| stop() | yes | yes | yes |
| setLoop() | yes | yes | yes |
| isLooping() | yes | yes | yes |
| isPlaying() | yes | yes | yes |
| isPaused() | yes | yes | yes |
| stop() | yes | yes | yes |
| setVolume() | yes | yes | yes |
| pan() | yes | yes | yes |
| getPan() | yes | yes | yes |
| duration() | yes | yes | yes |
| rate() | yes | yes | yes |
| currentTime() | unreliable | yes | yes |
| jump() | yes, but messes with currentTime()  | yes | yes, but messes wtih currentTime() |
| channels() | yes | yes | yes |
| sampleRate() | yes | yes | yes |
| frames() | yes | yes | yes |
| reverseBuffer() | no | yes | no |
| onended() | yes: stop() will trigger onended() twice | yes: same issue | yes: same issue |
| addCue()() | yes | yes | yes |

## p5.Amplitude
| Function | Chrome | Firefox | Safari |
| -------- | ------ | ------- | ------ |
| getLevel() | yes | no | yes |

## p5.FFT
| Function | Chrome | Firefox | Safari |
| -------- | ------ | ------- | ------ |
| analyze() | yes | yes | yes |

## p5.SoundRecorder
| Function | Chrome | Firefox | Safari |
| -------- | ------ | ------- | ------ |
| record() | yes | no: 0 length error, permission issue | no: same as Firefox, but works sometimes |
