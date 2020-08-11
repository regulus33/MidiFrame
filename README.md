## Welcome To Midi Frame 

https://github.com/regulus33/andrWert43h/tree/dev

Midi Frame is a powerful midi-driven video editor that makes it fun and easy to quickly generate audio-visual content and music videos with your favorrite class compliant midi devices. 

**Purge all development active sttorage records**

```ruby
ActiveStorage::Attachment.all.each { |attachment| attachment.purge }
```
[from here](https://stackoverflow.com/questions/51175944/remove-all-data-from-active-storage)

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


