

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


## Gotchas

### Rails master key

just grab from bitwarden and replace contents of file in `config/master.key`
with `h89787h739937hr` or whatever the latest key is. 

## TODOS FOR PRODUCTION

properly install redis for production i.e. server restarts and etc. 
https://redis.io/topics/quickstart 
also 
https://medium.com/@thomasroest/properly-setting-up-redis-and-sidekiq-in-production-on-ubuntu-16-04-f2c4897944b5