
## AWS Connect to RDS 

In order to connect to our db we need to add environment variables in two places, one is the .bashrc profile and the other is the nginx config file. 

in those files we list the username, password, endpoint etc. see bitwarden for the values. 

In the past, I have had problems with rds creating a default db. If you cant connect because `<DB-NAME> does not exist` simply connect to the rds using `psql` client and `CREATE DB <DB-NAME>`

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




