

## Webpacker setup stuff and rails 6 helpful tips 

https://dev.to/vvo/a-rails-6-setup-guide-for-2019-and-2020-hf5

--------

## Video dl cache etc 

SW OLD VIDEO EXAMPLE
https://googlechrome.github.io/samples/service-worker/prefetch-video/

CACHE VIDEO WITH SERVICE WORKER? 
https://stackoverflow.com/questions/41916875/is-it-possible-to-cache-an-entire-html5-video-using-the-service-worker-api-for-o

A THOROUGH EXPLANATION OF WEB VIDEO INCLUDING BUFFERS AND OBJECT URL 
https://medium.com/canal-tech/how-video-streaming-works-on-the-web-an-introduction-7919739f7e1

PRELOADING PREFETCHING ETC 

https://developers.google.com/web/fundamentals/media/fast-playback-with-video-preload#manual_buffering


## List of Browser dependencies

Midi API 

Caches API 

## Test Coverage 

view `coverage/index.html` after running tests for ruby

javascript tests are automatically outputting test coverage 

js run 
`rake test:js`

all run 
`rake`


## system dependencies:

1. `ffmpeg` for slicing video 

`brew install ffmpeg`

2. `sox` for slicing audio 

`brew install sox`


## Midi 

### Delta time and frames in midi 

Midi connections, just like any stream are fed to the consumer in frames. Delta time tells us the time a note occurs at since the last frame. Delta time is the time ellapsed between frames. 

in midi parsing, we see notes tied to delta time. The delta time combined with the time division will allow us to convert delta time to real time. Time division is either in ticks per pulse or frames per second.

## Autotune exec

compile: 
cd into tuner dir 
run 
`gcc ./*.c  -lsndfile -o tuner`

add this to your bashrc

`alias tuner= '/mid/midiframe/tuner/tuner'`
then you can run `tuner` as a command 


## AWS 

#### elastic ip address 
An elastic ip address is just a static ip that maps to whatever Ec2 instance you want to use. 
Its helpful for DNS resolution, so you can register `midiframe.com` to an ip that will never change regardless of how many ec2 instances you setup and associate with that url. 




## Project Summary:

Its been a long time since I had this idea and I'm stuck. Need to re-evaluate the validity of this. 

To me the project is not good enough to be considered a prototype. It

### What is the problem? 

Well... the problem is actually not related to us. Feels good to say. We have had a lot of challenges up to this point both internal and external that have been overcome or mitigated many of them. However, where we stand currently, the next step is eithert to compromise the quality of this project or to invest a significant amount of time/energy/money into developing a low level library that does what FFMPEG promises to do: increase frame rates of any input video without compromising playback. The idea is to duplicate frames in a video, lets say in a 30 fps video we want to make it 1000 to increase our chopping accuracy so we can cut at say 13 milliseconds instead of some quantized fraction of a second like 00:00:00.2. When you force ffmpeg to do this it will destroy the playback of the video. You can only effectively double the framerate without destroying the video. I've also tryed gradually increasing the framerate by doubling framerate then doubling again and again to no avail. 

So for now its time to take a step back. This project has been more a success than a failure. We've learned more than we could have imagined on the way up. We've learned C code, midi protocol, aws deployments, network security, video containers, algorithms, big O. The list goes on and this project only made me a better programmer and creative thinker/artist. 

The hard part is admitting defeate. But this is not me giving up, this is me creating space. This project is very very ambitious and probably would have been a piece of cake with a team along side me. The truth is that creating an entirely new product is an extreme challenge that requires patience. This step back is an excercise in patience. The

### Next Steps 

1. We need to learn everything there is to know about digital video. Luckily this goal coalesces with my job. I will benefit from many many levels. 

2. We need to be able to write C code as simply and efficiently as we write ruby. Do Codewars, whatever it takes. Myabe try to do something daily. This will make you a great programmer. 

3. Take some time to be creative and let your brain steap in dreams. Make art, make comics, write and make interesting CSS-art. Have some fun again! 

4. When we are proficient we can write a simple C script. All it must do is take any mp4 and output a video with 1000 fps. The video should playback normally. It should be faster than 5 minutes for a 10 minutes clip and should playback normally. 

Lastly, its ok to move on. 


