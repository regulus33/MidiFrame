## Welcome To Midi Frame 

https://github.com/regulus33/andrWert43h/tree/dev

Midi Frame is a powerful midi-driven video editor that makes it fun and easy to quickly generate audio-visual content and music videos with your favorrite class compliant midi devices. 

## Development docs 

### How is silence handled?

Example: pattern has a highat that comes in on the 2nd beat. There is silence in the beginning but each pattern clip needs to be the same length of time as the recorded pattern.

We just default that beginning snippet of time to be the first x seconds of the user's project-video. So if the silence lasts for 236 milliseconds, the snippet will be the first 236 milliseconds of their video. 

### helpful code snippets 

***Caution***
**purge all development active sttorage records**

why?: sometimes (if you're me) you'll thoughtlessly add new attachments and forget to delete them without creating the proper connections between the related tables to ensure recursive destruction of records. If you need to cleanup locally, you can run this to remove ALL ATTACMENTS

```ruby
ActiveStorage::Attachment.all.each { |attachment| attachment.purge }
```

[from here](https://stackoverflow.com/questions/51175944/remove-all-data-from-active-storage)


EC2 instance dependencies 

https://sourceforge.net/projects/matroska/files/mkclean/mkclean-0.8.10.tar.bz2/download for webm optimizations 
  
ffmpeg 
redis
mcklean


