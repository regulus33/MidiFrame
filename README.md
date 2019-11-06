DOCSSSSSSSS


                  ____________________________________________________
                 |____________________________________________________|
                 | __     __   ____   ___ ||  ____    ____     _  __  |
                 ||  |__ |--|_| || |_|   |||_|**|*|__|+|+||___| ||  | |
                 ||==|^^||--| |=||=| |=*=||| |~~|~|  |=|=|| | |~||==| |
                 ||  |##||  | | || | |JRO|||-|  | |==|+|+||-|-|~||__| |
                 ||__|__||__|_|_||_|_|___|||_|__|_|__|_|_||_|_|_||__|_|
                 ||_______________________||__________________________|
                 | _____________________  ||      __   __  _  __    _ |
                 ||=|=|=|=|=|=|=|=|=|=|=| __..\/ |  |_|  ||#||==|  / /|
                 || | | | | | | | | | | |/\ \  \\|++|=|  || ||==| / / |
                 ||_|_|_|_|_|_|_|_|_|_|_/_/\_.___\__|_|__||_||__|/_/__|
                 |____________________ /\~()/()~//\ __________________|
                 | __   __    _  _     \_  (_ .  _/ _    ___     _____|
                 ||~~|_|..|__| || |_ _   \ //\\ /  |=|__|~|~|___| | | |
                 ||--|+|^^|==|1||2| | |__/\ __ /\__| |==|x|x|+|+|=|=|=|
                 ||__|_|__|__|_||_|_| /  \ \  / /  \_|__|_|_|_|_|_|_|_|
                 |_________________ _/    \/\/\/    \_ _______________|
                 | _____   _   __  |/      \../      \|  __   __   ___|
                 ||_____|_| |_|##|_||   |   \/ __|   ||_|==|_|++|_|-|||
                 ||______||=|#|--| |\   \   o    /   /| |  |~|  | | |||
                 ||______||_|_|__|_|_\   \  o   /   /_|_|__|_|__|_|_|||
                 |_________ __________\___\____/___/___________ ______|
                 |__    _  /    ________     ______           /| _ _ _|
                 |\ \  |=|/   //    /| //   /  /  / |        / ||%|%|%|
                 | \/\ |*/  .//____//.//   /__/__/ (_)      /  ||=|=|=|
               __|  \/\|/   /(____|/ //                    /  /||~|~|~|__
                 |___\_/   /________//   ________         /  / ||_|_|_|
                 |___ /   (|________/   |\_______\       /  /| |______|
                     /                  \|________)     /  / | |


# What dun du???

Plugin your op-z and hash together a vid from some recorded midi. 

```js
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

It kicks off the first step in the chain of processing. It molds the data created by midi.js into something we can process and analyze. 

## methods:

``` js
getMidiChannel(event)
```

The midi.js api (and the midi specification in general) use an unusual format to store notes. Most values end up being between 0 and 127. Since we are not number genius computers, we made this method to translate one of these numbers into something from 1-16 (which are the standard midi channel numbers) 

| parameters        | description           | example  |
| ------------- |:-------------:| -----:|
| event   | a simple object  | `{data: ['127','127','127']}` | 



returns `string`

---


```js
sortedEventsToChannels(events)
```

Takes an array of midi.js events and outputs an object where each key represents a midi channel (1 -16) and each value represents a collection of midi events that happened in that channel.

| parameters        | description           | example  |
| ------------- |:-------------:| -----:|
| events   | an array  | NA | 

returns `object`

---


```js
determineNoteOnOff(event)
```

True is on, false is off. The arg is a midi.js event.   

| parameters        | description           | example  |
| ------------- |:-------------:| -----:|
| event  | object  | `{data: ['127','127','127']}` | 

returns `object`



  
  ---

```js
bakeDataForParsing(recordedMidi)
```

The return value is similar to `sortedEventsToChannels` and calls that function, but it returns an object with values that have been processed further and are more readilly iterated, deconstructed and unpacked. 

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
 
Builds strings ready to execute as shell commands based on the data output by MidiMapper

in the constructor: 
```js
constructor(channel,notes,clip, data)
```
* channel: channel this instance assigned to 
* notes: which notes (represented by arbitrary unique nums) are played in this channel
* a string rep of path to video to be


## methods 

returns `string`


```js
generateChannelSliceCommands()
```

Takes all the data required to calculate slices to concat later from instance variables of the miditovideo object. Generates an array of system commands to be executed by another method. 

Intervals are calculated by looking ahead to the next note that happens in time and subtracting the difference of the successor's start time and the current's begin time. 

returns `array`

---

```js
makeClips()
```

Self explanatory. Use this in the server code to kick off process.

---

```js
generateFfmpegConcatArgsForSelf()
```

Reads all entries in the folder where we keep the midi slices for this channel. `/midi_slices/channel_1/`

concats all them files  

returns array of strings that look like this: `file '/Users/zacharyrowden/Desktop/notes/midi_slices/channel_2/5.2323455.mp4'`

```js
createClip()
```

The last step in the chain. Generates a rythmic clip. Other processes must update the state of MidiToVideo instance before this....

---

```js
createInput()
```

Generates a .txt file. Its fed to ffmpeg as an arg. 

---


## All network calls are consolidated to `network.js`
this is for testing, we need to be able to mock server responses

---

### Components: Containers

`VideoSelectorContainer`

Video container selector. Its the only smart component. All UI related methods and form data are processed here. 


### state:
```js
this.state = {
  videoFiles:[], //selectable els
  selectedVideoPath: "", //path of chosen video
  selectedChannel: "1", //path of selected channel
  notes:{} //notes used in this channel 
};
```

### methods:
---
`contructor(props)`

props are made up of:  

`rawMidi` (soon to be deleted, its just test midi data)

`midiCollector` which is just an instance of `BrowserMidiCollector` so we can get references to form data and recorded midi data. 

---

```js
getUsedNotesObject()
```
takes the midi that has been sent so far from opz to midi.js to the component's `state.latestCapturedMidi` (a collection of simple midi events)

---

```js
componentDidMount()
```

We know what its for but what we do in that method and why:

```js
    //When user hits 'r' we add the latest played midi to the state.latestCapturedMidi
    this.handleRefreshClick()
    //fetch video files from the vid directory for form 
    this.fetchVideoFilePaths()
    //set a default selected channel (their shouldn't be one til you record midi so this might change)
    this.setState({selectedChannel: Object.keys(this.getUsedNotesObject())[0]})
```

Basically we set some form data and register click listeners, will add more soon.

---

```js
fetchVideoFilePaths()
```

self expl...

---

```js
handleVideoOptionClick(event)
```

sets the form to display the selected video. At the moment it does not update in any meaningful way, only displays data

TODO: this would be a good place to call a shared method that 'notifies data sset changed' and would retrigger an update of a form representing this object. Also why don't we update the state here but we do so everywhere else?

---

```js 
 handleTimeStampInput(event)
```

This could probably be improved. It scrapes every form every time the user hits a key inside a text edit. Then iterates through all inputs on the dom and sets a new empty object representing the current values. This asssumes that when we change the form we wipe all the state for these forms, which is probably a fine way to do it. We still need to make sure that we are persisting selected fields somewhere though so a user comes back to texdt inputs for channel 5 from 6 and sees the data they entered. 

```js 
     let noteTimeObj = {}
        
        let inputs = document.getElementsByClassName("noteTextField")
        for(let i = 0; i < inputs.length; i++) {
            noteTimeObj[inputs[i].name] = inputs[i].value 
        }

        this.setState({notes:noteTimeObj})
```

---

```js 
  handleChannelOptionClick(event)
```

Simply explained, this one just sets the state to the value of the option the user clicks CHANNEL state that is.

---

```js 
renderOptionsForChannelPickerData()
```

calls getUsedNotesObject() to get an to get this object

---

```js
{
  7: [134,34,134,156],
  8: [123,345,235]
}
```
this object has the channels as keys so we call 
`Object.keys` and map an array of these channel strings into `<Option/>` for user selection. 

SUPER SIMPLE... but could be simplified more. 

---

```js
renderNoteInputs() 
```

The purpose is to figure out which notes should be associated with the selected channel. 

CURRENTLY its a little over complexicated. 

We have to get notes that occur in this channel which we do in a very roundabout way by reversing the channels:notes object. Anyway, each time you click a channel, we recalc this stuff. 

---

```js
renderOptionsForVideoDropDown()
```
Just maps a bunch of options out. 

---

```js
handleRefreshClick()
```
when user hits r we refresh the incoming midi data

We bind the onkeyup event to document.

which then sets the state of captured midi to whtever was recorded by the `midiCollector` which is the instance of `BrowserMidiCollector`

---


# BrowserMidiCollector.js

We need something to intercept midi events as they come in, store them in BrowserMidiCollector 

The BrowserMidiCollector initializes the listeners for incoming midi data. 

---

##methods

Most important
```js
updateState(options={})
```

It commits state from each form for each channel to a keep track of able global statey object. 
Should refactor and separate this out eventually.

You provide it options like this 

```js
 let midiCollector = new BrowserMidiCollector()
    let options = {}
    options.channel = "6"
    options.videoPath = "35InaMillion.mpeg"
    options.VideoSelectorContainer = pretendState.notes
    midiCollector.updateState(options)
```

---

```js
onMidiMessage = (message)
```
Registers reactions to midi events from midi.js that fork into two directions. One is for processing data to save into a server side parceable json msg. The other is to process each individual event as a video playback queu for realtime midi visualization. 


THE BEST TIME TO DO THIS i THIIINK is in the render method since we know that the state has changed and the only way to change it there is when we submit forms, but I could be wrong. We'll see DELETE ME LATER ZACK

---
```js
translateForeignMidiEvent(event)
```
This gets midi ready for any processing we want to do in the browser. Tells us if the note is noteOn, its channel and its note number, lots of unneccessary bullshit that could be cleaned the FUCK OUT. BUT Do I look like I have FUCKING TIME?!!!
Deal with it. 
;) 
```js
    //all this needs to tell us is if the currently selected form data permits this note to be a part of the midi playing
    translateForeignMidiEvent(event) {
      let result = {}
      if(!MidiMapper.determineNoteOnOff(event)) {
        return null
      }
      let channel = MidiMapper.getMidiChannel(event)
      result["channel"] = channel 
      result["noteNumber"] = event.data[1]
      return result 
    }
```

## TODO 


Clear notes fields on form change

 the midi specification makes processing real time events extremely efficient if we mapp things more easily and factor in big O 

think object notation vs iteration and checking. amen





