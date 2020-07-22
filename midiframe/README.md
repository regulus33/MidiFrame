

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

3. PyAutoTune for quantizing video audio

https://github.com/ederwander/PyAutoTune

a. install python if you dont have it 

b. install pip `brew install python`

c. `pip3 install numpy`

d. there will be a numpy not imported error 


```
First, in python, import numpy and numpy.get_include() to get the numpy source file location, which is /usr/local/lib/python2.7/site-packages/numpy/core/include/numpy in my case.

Then, copy the directory to global include directory by cp -r /System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/numpy/core/include /usr/local/include.
```

d. install a c compiler if there is none 

e. `sudo python setup.py install` 

For input audio file and output:

`brew install libsndfile`

f. `pip3 install scikits.audiolab`

NOTE; there was an import error initially that prevented us from importing numpy. 
just check voer this: https://github.com/andersbll/cudarray/issues/25 for troubleshooting on new machines. 

NOTE; there seems to be a sub directory with more up to date tooling if required, check `ForPy2X` subfolder.

Now you have installed pyautotune,