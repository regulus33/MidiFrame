## Welcome To Midi Frame 

Midi Frame is a powerful midi-driven video editor that makes it fun and easy to quickly generate audio-visual content and music videos with your favorrite class compliant midi devices. 


## Development docs 


### helpful code snippets 

**purge all development active sttorage records**

why?: sometimes (if you're me) you'll thoughtlessly add new attachments and forget to delete them without creating the proper connections between the related tables to ensure recursive destruction of records. If you need to cleanup locally, you can run this to remove ALL ATTACMENTS

```ruby
ActiveStorage::Attachment.all.each { |attachment| attachment.purge }
```

