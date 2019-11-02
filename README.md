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

TODO:

descrube the methods









