<img src="./midiframe.png" width="800"/>

**Creates mp4 files based on midi captured data**


**Make File Mono** 
```
sox infile.wav outfile.wav remix 1,2
```


**Compile and run autotune** 
```
cd tuner 
gcc ./*.c  -lsndfile -o tuner 
./tuner inputfile.wav outputfile.wav c
```


EC2 instance dependencies 

https://sourceforge.net/projects/matroska/files/mkclean/mkclean-0.8.10.tar.bz2/download for webm optimizations 
  
ffmpeg 
redis
mcklean
lbsndfile 
sox 



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


