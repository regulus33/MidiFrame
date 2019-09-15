# General Summary

This is a web application designed to auto-generate music videos based on midi-data sent from a comprehensive midi sequencer such as the Teenage Engineering OP-Z. The application is dessigned to run locally only and requires that the host machine have FFMPEG installed. 

The midi processing is divided into two main classes. MidiToVideo and MidiMapper. 

Midi mapper processes "raw" midi data in a JSON file transferred over http. The app is never meant to run in the wild. 

Midi mapper takes a series of numeric values and generates meaningful data for our midi to video process. 

The MidiToVideo class takes this data and a supplied video path argument and cuts the videos into concatable slices which get reassembled in a rythmic order. 

The client side code is responsible for displaying a complex array of data to the user to collect the input used by the ffmpeg integrations on the backend. 

In order to document and better understand these features for myself, I have laid out a summary of the user experience below. 

When I open the main page I see 8 dropdowns each listing all videos in the main asset directory(this can be set by a constant on the backend).

The dropdown displays all videos from which I am allowed to associate a particular channel. The first dropdown is associated with channel 1 and the 8th dropdown is associated with channel 8. 

The user will be able to view the video in an html5 video element and decide which timestamps to associate the recorded notes in  the channel with. 

The above action requires some midi parsing to group events into notes belonging to channels. 

For each channel, there is a text input belonging to the note-ons fired in the song. User will choose a timestamp for each note. 

we then send the midi data of the song 

```json
midi: {
  song: [
    //a bunch of midi events
  ],
  //the 
  config: {
    "1": {
      notes: [
        "54" : "3:45",
        "34" : "2:31"
      ],
      clip: "/path/to/clip/beethoven.mp4"
    }
  }
}
```

# MidiMapper (prepares midi data for the logic)


## description: 

Client side, it sends the resulting data mods to the server where node processes it into ffmpeg stuff
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

converts mapped, parsed midi into instructions for ffmpeg to build its video clips, this is run server side.  

## methods 

`getMidiChannel(event)`

provides data for the instance to figure out what will be in its clip instructions. The realtionship is 1 to 1 as in: midi channel 16 will be mapped to video 'a' and only one `miditovideo` instance will be responsible for creating the file for this channel, a new one of the next channel and so on. 

each channel can only be mapped to a single video file. 

| parameters        | description           | example  |
| ------------- |:-------------:| -----:|
| channel   | midi channel, string  | `"4"` | 
| notesToStamps   | key val pair of notes and the timestamps they should be bound to in their video.  | `{"56":"3:36","35":"4:22"}` | 
| video   | string, absolute path of video, provided and selected by user  | `"Users/foo/bar/baz/vid.mp4"` | 
| data   | object of channels as keys and processable arrays of midi events as values  | NA | 



returns `string`

---

`generateFfmpegConcatArgsForSelf()`

Reads all entries in the channel directory that the instance is responsible for. `/midi_slices/channel_1/`

builds a concated  file based on the entries  

returns array of: `file '/Users/zacharyrowden/Desktop/notes/midi_slices/channel_2/5.2323455.mp4'`


---










