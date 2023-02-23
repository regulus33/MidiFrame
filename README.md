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




