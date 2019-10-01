# What duhit du

Plugin your op-z and hash together a vid from some recorded midi. 

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

# MidiMapper 

All it does is convert browser recording of midi events into a format we can use on the server. 

## methods 

`getMidiChannel(event)`

will determine the human readable midi channel from unprocessed midi data. Takes custom event objects as an argument. 

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


returns `true` for on and `false` for off. We need to use this to know when a note ends.  

| parameters        | description           | example  |
| ------------- |:-------------:| -----:|
| event  | object  | `{data: ['127','127','127']}` | 

returns `object`



  
  ---

`bakeDataForParsing(recordedMidi)`

returns an object where each key is a midi channel and each value is an array of events that occured on that midi channel. The inidividual objects specify note, whether its being pressed or released and velocity number. 

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

---

# MidiToVideo
 
converts the data created by midi mapper to FFMPEG commands and runs them to stitch video. 

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


`generateChannelSliceCommands()`

Takes all the data required to calculate slices to concat later from member vars of the miditovideo instance. Generates an array of system commands to be executed by another method. Intervals are calculated by looking ahead to the next note that happens in time. The clip length becomes the time between the striking of the midi note and the striking of its successor. Therefore, polyphonic notes cannot be processed and will force a monophonic reading. 



returns `array`

---

`makeClips()`

Public (as in this is what is actually used by other processess from this class.) 

---

`generateFfmpegConcatArgsForSelf()`

Reads all entries in the channel directory that the instance is responsible for. `/midi_slices/channel_1/`


builds a concated  file based on the entries  

returns array of: `file '/Users/zacharyrowden/Desktop/notes/midi_slices/channel_2/5.2323455.mp4'`

`createClip`

Creates the clip by calling all the internal methods that generate the requirements and returns the path to the finished video. 

---

## All network calls are consolidated to `network.js`
this is for testing, we need to be able to mock server responses

---

### Components: Containers

`VideoSelectorContainer`

Video container is a stateful component responsible for displaying 
a video element and a drop down menu for video selection.

It will trigger re-renders when fetches are made for videos and when inputs are selected. 

it rneders the following sub components:
`VideoSelector.js renders:`
`\\ VideoDisplayer.js` 
`and html for select, in that html we call props.renderOptionsForDropDown() passed from VideoContainer.js`

```js
   return (
        <div style={{ width: "100%", margin: "auto" }}>
            <select onChange={props.handleOptionClick}>
                {props.renderOptionsForDropDown()}
            </select>
            <VideoDisplayer videoPath={props.selectedVideoPath}/>
        </div>
    )
```








