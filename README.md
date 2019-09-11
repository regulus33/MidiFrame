
# MidiMapper (prepares midi data for the logic)


## description: 

Basic midi parsing from the junk we get from the js midi api. 

## methods 

`getMidiChannel(event)`

will determine the human readable midi channel from unprocessed midi data. Takes our custom event objects as an argument. 

| parameters        | description           | example  |
| ------------- |:-------------:| -----:|
| event   | a simple object  | `{data: ['127','127','127']}` | 



returns `string`

---


`sortedEventsToChannels(events)`


Iterates through a provided array of raw unprocessed midi events. returns an object of keyed number strings representing channels:

| parameters        | description           | example  |
| ------------- |:-------------:| -----:|
| events   | an array  | NA | 

returns `object`

---


`determineNoteOnOff(event)`


returns `true` for on and `false` for off 

| parameters        | description           | example  |
| ------------- |:-------------:| -----:|
| event  | object  | `{data: ['127','127','127']}` | 

returns `object`



  
  ---

`bakeDataForParsing(recordedMidi)`


returns an object 
like this 

``` javascript
    {
      '3': [
        {
          noteOn: true,
          timeStamp: 1,
          noteNumber: '54',
          velocityNumber: '100'
        }
      ]
    }
```

| parameters        | description           | example  |
| ------------- |:-------------:| -----:|
| recordedMidi  | json array, just the raw midi event captures you record in the browser  | NA| 

returns `object`




# MidiToVideo

## description: 

converts mapped, parsed midi into instructions for ffmpeg to build its video clips 

## methods 

`getMidiChannel(event)`

provides data for the instance to figure out what will be in its clip instructions. The realtionship is 1 to 1 as in: midi channel 16 will be mapped to video 'a' and only one `miditovideo` instance will be responsible for creating the file for this channel, a new one of the next channel and so on. 

each channel can only be mapped to a single video file. 

| parameters        | description           | example  |
| ------------- |:-------------:| -----:|
| channel   | midi channel, string  | `"4"` | 
| notesToStamps   | key val pair of notes and the timestamps they should be bound to in their video.  | `{"56":"3:36","35":"4:22"}` | 
| video   | string, absolute path of video, provided and selected by user  | `"Users/foo/bar/baz/vid.mp4"` | 



returns `string`

---

`generateFfmpegConcatArgsForSelf()`

Reads all entries in the channel directory that the instance is responsible for. `/midi_slices/channel_1/`

builds a concated  file based on the entries  

returns array of: `file '/Users/zacharyrowden/Desktop/notes/midi_slices/channel_2/5.2323455.mp4'`


---










