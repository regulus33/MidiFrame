import MidiMapper from "./MidiMapper.js"
import MidiPlayerLive from "./MidiPlayerLive.js"
import MidiCounter from "./MidiCounter.js"

import {
  postMidiData
} from '../network.js'

const ON_CHANNELS = {
  "144": "1",
  "145": "2",
  "146": "3",
  "147": "4",
  "148": "5",
  "149": "6",
  "150": "7",
  "151": "8",
  "152": "9",
  "153": "10",
  "154": "11",
  "155": "12",
  "156": "13",
  "157": "14",
  "158": "15",
  "159": "16"
}

const OFF_CHANNELS = {
  '128': '1',
  '129': '2',
  '130': '3',
  '131': '4',
  '132': '5',
  '133': '6',
  '134': '7',
  '135': '8',
  '136': '9',
  '137': '10',
  '138': '11',
  '139': '12',
  '140': '13',
  '141': '14',
  '142': '15',
  '143': '16'
}

export default class BrowserMidiCollector {
    constructor() {
        //for sending to server
        this.activeChannel = ""
        //TODO: DELTE ME
        this.midiToBeMapped = []
        this.receivedAnyMessageYet = false 
        this.userMessage = ""
        this.recording = false 
        this.videoPlayer = null //this will be a video player 
        //FOR AUTOMATION OF START AND STOP MESSSAGES IN RECORDING
        this.midiAccess = null//need to use it to send messsagess later in reconfigure midi for recoring 
        this.deviceId = 0//need to use it to send messsagess later in reconfigure midi for recoring 
       //96 clocks per 1 bar or 1 full note 
        this.clockPulsesSinceRecordStart = 0 
        //need to store the bar count selected by user 
        this.barCountForRecording = 0
        /////////////////////////////////////
        /// How Long should the clip be  ///////////////////////////>>>>>>>
        //////////////////////////////////
        this.patternDuration = 0.0
        //need the below two to calc the above 
        this.midiRecordingStartedAt = 0.0 
        this.midiRecordingFirstNoteAt = 0.0 
        this.midiData = {
            "1":{},
            "2":{},
            "3":{},
            "4":{},
            "5":{},
            "6":{},
            "7":{},
            "8":{},
            "9":{},
            "10":{},
            "11":{},
            "12":{},
            "13":{},
            "14":{},
            "15":{},
            "16":{}
        }
        //TODO: are we using this anymore? 
        this.notesAndChannels = {
          "1": new Set(),
          "2": new Set(),
          "3": new Set(),
          "4": new Set(),
          "5": new Set(),
          "6": new Set(),
          "7": new Set(),
          "8": new Set(),
          "9": new Set(),
          "10": new Set(),
          "11": new Set(),
          "12": new Set(),
          "13": new Set(),
          "14": new Set(),
          "15": new Set(),
          "16": new Set()
      }
    }

    activeChannelChange(channelString) {
      this.activeChannel = channelString
    }

    startMidi = () => {
        return navigator.requestMIDIAccess().then( access => {
          //there should really only be one here, but you never know 
          // console.log(access.inputs);
          const devices = access.inputs.values();
          for (let device of devices ) {
            debugger 
            
            if (device.name == "OP-Z") {
              console.log(device.name)
              this.userMessage = `${device.name} is connected!`
              // device.onmidimessage = this.onMidiMessage //keep
              device.onmidimessage = this.onMidiMessageJamming 
              device.onstatechange = this.handleOPZChange //change to have msg sent when we hit stop button 
            } else {
              this.userMessage = "Something's wrong, do you have the OP-Z connected?"
            }

          }
        }).catch(console.error);
    }

    reconfigureMidiForRecording = () => {
      return navigator.requestMIDIAccess().then( access => {
        //there should really only be one here, but you never know
        const outputs = access.outputs.values()
        for (let output of outputs ) {
          this.midiAccess = access
          this.deviceId = output.id 
          
        }
        const devices = access.inputs.values();
        for (let device of devices ) {
          if (device.name == "OP-Z") {
            //SET PERMISSIONS TO SEND MIDI DATA TO DEVICE
            ////////////////////////////////////////////
            console.log(device.name)
            this.userMessage = `${device.name} is reconnected!`
            // device.onmidimessage = this.onMidiMessage
            device.onmidimessage = this.onMidiMessageRecording 
            device.onstatechange = this.handleOPZChange //change to have msg sent when we hit stop button 

          } else {
            this.userMessage = "Something's wrong, do you have the OP-Z connected?"
          }

        }
      }).catch(console.error);
    }

    onMidiMessageRecording = (message) => {
      //if you bind the stop and start events to the clock signal, the clipping should be adequately quantized 
      if(message.data[0] == 248 && this.recording){
        //if it isnt already set then we havent hit the first note yet 
      
        //so to explain, on each clock pulse, we check if this loop should exit.
        //user sets total bars in midirecordercontainer. 
        this.clockPulsesSinceRecordStart += 1
        if(this.clockPulsesSinceRecordStart == MidiCounter.getLength(this.barCountForRecording)){
          this.stopMidiRecording()
        }
      }

      if(message.data[0] == 250) {
        console.log("OPZ LOOP STARTING")
        this.recording = true 
        //record the beginning stamp of this session 
        this.midiRecordingStartedAt = Date.now()  
      } 

      //THE END OF RECORDING:
      //see this.stopMidiRecording(), we do it in the code and send the message to stop to op-z 
      //all unhooking and processing is done there  

      if(this.recording) {
        console.log("MIDI IS RECORDING")
        if ((ON_CHANNELS[message.data[0]] != undefined)) {
          this.midiToBeMapped.push(this.processEvent(message))
          //this is a callback added to the instance inside midirecordercontainer 
          
          //if this message is from the active channel 
          console.log("MAMMAMAMAMAMAMAM")
          console.log(this.activeChannel)
          if(ON_CHANNELS[message.data[0]] == this.activeChannel){
            this.onNoteRecorded(this.processEvent(message))
            //if this is the channel we selected, this needss to be processed for clip duration detection 
            if(this.midiRecordingFirstNoteAt == 0.0) {
              this.midiRecordingFirstNoteAt = Date.now() 
            }
          }
        }
      }
    }

    onMidiMessageJamming = (message) => {
       if(message["data"][0]!=248){
        console.log(message)

      }
      if(this.recording){
        return 
      }
      if(!!ON_CHANNELS[message.data[0]]) {
        if(!this.receivedAnyMessageYet ) {
          this.handleFirstMidiMessage(message.data[0])
        }
        
        this.notesAndChannels[ON_CHANNELS[message.data[0]]].add(message.data[1])
        
        if(this.notesHasBeenDefined()) {
         MidiPlayerLive.playNote(message["data"][0], message["data"][1], this.activeChannel, this.midiData[this.activeChannel]["notes"],this.videoPlayer)//send the videoPlayer instance so we can call currentTime(3), sets the time that the playhead hits on each midi note
        }
      }
    }
    //TODO: split all these conditions up into separe functions to be picked on initialization 
    onMidiMessage = (message) => {
      //message data 0 is telling us if we are an off or on channel and which channel (1 - 16) at the same time 
      // console.log(message.data[0].toString())
      // console.log(message.timeStamp)
      //if its an on channel or off, its relevant, so commit it to the json 
      // TODO:its unneccessary to convert these to strings leave them as they are
      if ((ON_CHANNELS[message.data[0]] != undefined) || (OFF_CHANNELS[message.data[0]] != undefined)) {
        //SET THIS AS THE ACTIVE CHANNEL IF FIRST MESSAGE< NEEDED FOR FORM
        if(!this.receivedAnyMessageYet){
          this.handleFirstMidiMessage(message.data[0])
        }

        //prepare the event to be processed
        let stringedData = []
        message.data.forEach((d)=>{stringedData.push(d.toString())})
        let midiEvent = {
          data: stringedData,
          timeStamp: message.timeStamp
        }
        this.midiToBeMapped.push(midiEvent)
         if(
          this.activeChannel != "" &&
          this.midiData[this.activeChannel]["notes"] != undefined && 
          this.midiData[this.activeChannel]["notes"][midiEvent["data"][1]] != undefined
          ) {

          MidiPlayerLive.playNote(midiEvent,this.activeChannel,this.midiData[this.activeChannel]["notes"], this.videoPlayer)
         }                                                 ////
      } 
    }

    handleFirstMidiMessage(message) {
        this.activeChannel = ON_CHANNELS[message]
        this.receivedAnyMessageYet = true 
    }

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

    //persists state beyond channel form changes
    //will remain intact for the lifecycle of the app
    updateState(state = {}) {
      this.midiData[state.selectedChannel] = {
        notes: state.notes,
        videoPath: state.selectedVideoPath
      }
      
    }

    updatePatternDuration(duration) {
      this.patternDuration = duration
    }
    //need this for the time stamp input
    updateNotesForTimestampOnly(notes) {
      this.midiData[this.activeChannel]["notes"] = Object.assign({}, notes)
    }
    
    //convert filled sets to arrays and leaves out key val pairs with emptiness
    getNotesAndChannels() {
      let dataForUI = {}
      Object.keys(this.notesAndChannels).forEach((channelNum)=>{
        if(this.notesAndChannels[channelNum].size > 0) {
          dataForUI[channelNum] = Array.from(this.notesAndChannels[channelNum])
        }
      })
      return dataForUI
    }

    notesHasBeenDefined(){
      return this.midiData[this.activeChannel]["notes"] != undefined
    }

    formatMidiDataForStorage(name = null) {
      let data = this.midiData
      let songData = this.midiToBeMapped
      let namee
      name ? namee = name : namee = Date.now()  
      return {
        data: data,
        name: namee ,
        midiToBeMapped: songData,
      }
    }

    storeMidiDataInLocalStorage(name = null, window = window) {
      let oldProjects = window.localStorage.getItem('opz-app')
      if(oldProjects) {
        let unStringed = JSON.parse(oldProjects)
        unStringed.push(this.formatMidiDataForStorage(name))
        window.localStorage.setItem('opz-app', JSON.stringify(unStringed))
      } else {//this is the first project
        window.localStorage.setItem('opz-app', JSON.stringify([this.formatMidiDataForStorage(name)]))
      }
    }

    //removes item from array and overwrites the old one
    deleteMidiDataFromLocalStorage(name = null, window = window) {
      let allProjects = window.localStorage.getItem('opz-app')
      let unStringed = JSON.parse(allProjects)
      let cleanedObject = unStringed.filter((storageObject)=>{
        //only return elements that do not equal this one  
        return storageObject.name != name 
      })
      //remove the specified key and re-ssave a new collection of k v pairs without the specified 1. 
      window.localStorage.setItem('opz-app',JSON.stringify(cleanedObject))
    }

    wipeData(data){
      this.midiData = {
        "1":{},
        "2":{},
        "3":{},
        "4":{},
        "5":{},
        "6":{},
        "7":{},
        "8":{},
        "9":{},
        "10":{},
        "11":{},
        "12":{},
        "13":{},
        "14":{},
        "15":{},
        "16":{}
    }
    this.notesAndChannels = {
      "1": new Set(),
      "2": new Set(),
      "3": new Set(),
      "4": new Set(),
      "5": new Set(),
      "6": new Set(),
      "7": new Set(),
      "8": new Set(),
      "9": new Set(),
      "10": new Set(),
      "11": new Set(),
      "12": new Set(),  
      "13": new Set(),
      "14": new Set(),
      "15": new Set(),
      "16": new Set()
    }

  }

  updateNotesAndChansFromLoad(midiDataa) {
    Object.keys(midiDataa).forEach( ( e ) => {
      if( midiDataa[e]["notes"] != undefined ) {

      Object.keys(midiDataa[e]['notes']).forEach( ( f ) => {
          this.notesAndChannels[e].add(f)
      })
      }
    })
  }

  processEvent(message){
    let newObject = {}
    newObject["data"] = message.data 
    newObject["timeStamp"] = message.timeStamp 
    return newObject
  }
  //////
  //////
  completeRecording() {
    const mapper = new MidiMapper(this.midiToBeMapped)
    const dataForServer = mapper.bakeDataForParsing()
    console.log(dataForServer)
    this.sendData(dataForServer)
  }

  
  prepareDataForProcessing(data){
    //PLUCK only the data from the active channel 
    //en ressults of the blocks below are like 
    //{4: metadatastuff}
    //{4: mididatastuff}
    // const midiNotes = {}
    // midiNotes[this.activeChannel] = data[this.activeChannel]

    // const metaData = {}
    // metaData[this.activeChannel] = this.midiData[this.activeChannel]
    
    return {
      channel: this.activeChannel,
      metaData:  this.midiData[this.activeChannel], //which notes are connected to which timestamp in which video 
      data:  data[this.activeChannel], //just the midi data for this channel 
      patternDuration: this.patternDuration,//length that this midi pattern is in the op-z and its expected output video length
      idlePeriodDuration: this.idlePeriodDuration()//the period between clip start and the first note played on
    }
    
  }

  sendData(data) {
    const dataToSendToServer = this.prepareDataForProcessing(data)
    console.log("server data", dataToSendToServer)
    postMidiData(dataToSendToServer, this.clearMusicDataAfterSendingToServer)
  }

  setVideoPlayer(player) {
    this.videoPlayer = player 
  }

  stopMidiRecording(){
    const output = this.midiAccess.outputs.get(this.deviceId);
    console.log("OPZ LOOP STOPPING")
    this.recording = false 
    this.completeRecording(this.midiToBeMapped)
    //stop the op-z after we stop listening for midi, the internal recording is all that really matters here.
    output.send([252])
  }

  idlePeriodDuration(){
    return this.midiRecordingFirstNoteAt - this.midiRecordingStartedAt
  }

  
  

}

