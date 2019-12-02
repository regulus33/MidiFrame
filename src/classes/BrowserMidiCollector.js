import MidiMapper from "./MidiMapper.js"
import MidiPlayerLive from "./MidiPlayerLive.js"
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
        //TODO DELETE Me
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
        //used notes here
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
            
            if (device.name == "OP-Z") {
              console.log(device.name)
              this.userMessage = `${device.name} is connected!`
              // device.onmidimessage = this.onMidiMessage //keep
              device.onmidimessage = this.onMidiMessageA 
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
        debugger // console.log(access.inputs);
        const devices = access.inputs.values();
        for (let device of devices ) {
          if (device.name == "OP-Z") {
            console.log(device.name)
            this.userMessage = `${device.name} is reconnected!`
            // device.onmidimessage = this.onMidiMessage //keep
            device.onmidimessage = this.onMidiMessageB 
            device.onstatechange = this.handleOPZChange //change to have msg sent when we hit stop button 

          } else {
            this.userMessage = "Something's wrong, do you have the OP-Z connected?"
          }

        }
      }).catch(console.error);
    }

    onMidiMessageB = (message) => {
      if(message.data[0] == 250) {
        console.log("OPZ LOOP STARTING")
        this.recording = true 
      } 
      if(message.data[0] == 252) {
        console.log("OPZ LOOP STOPPING")
        this.recording = false 
        this.completeRecording(this.midiToBeMapped)

      }

      if(this.recording) {
        console.log("MIDI IS RECORDING")
        if ((ON_CHANNELS[message.data[0]] != undefined) || (OFF_CHANNELS[message.data[0]] != undefined)) {
          this.midiToBeMapped.push(this.processEvent(message))
          //this is a callback added to the instance inside midirecordercontainer 
          this.onNoteRecorded(this.processEvent(message))
        }
      }
    }

    onMidiMessageA = (message) => {
      //TODO: THIS BREAKS FOR SOME REASON WE SHOULDNT HAVE ON MIDIMESSAGE A RUNNING WHEN WE THING WE RESET THAT FUNCTION
      if(this.recording){
        return 
      }
      if(!!ON_CHANNELS[message.data[0]]) {
        if(!this.receivedAnyMessageYet ) {
          this.handleFirstMidiMessage(message.data[0])
        }
   
        //add note to local note detection
        this.notesAndChannels[ON_CHANNELS[message.data[0]]].add(message.data[1])
        //before we actually fill in notes in form we should skip this 
        
        if(this.notesHasBeenDefined()) {
         MidiPlayerLive.playNote(message["data"][0], message["data"][1], this.activeChannel, this.midiData[this.activeChannel]["notes"])
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
         /////////////////////////////////////////////////////////
         ////                                                 ////
         ////  first add the events to an array unprocessed   ////                                             
         ////                                                 ////
         /////////////////////////////////////////////////////////
        this.midiToBeMapped.push(midiEvent)
         /////////////////////////////////////////////////////////
         
         if(
          this.activeChannel != "" &&
          this.midiData[this.activeChannel]["notes"] != undefined && 
          this.midiData[this.activeChannel]["notes"][midiEvent["data"][1]] != undefined
          ) {

          MidiPlayerLive.playNote(midiEvent,this.activeChannel,this.midiData[this.activeChannel]["notes"])
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

    //eat arguments and commit to the saved state attached to this instance
    //persists state beyond channel form changes
    //I guess this is kind of a ZACK makeshift version of what redux used to be???
    updateState(state = {}) {
      this.midiData[state.selectedChannel] = {
        notes: state.notes,
        videoPath: state.videoPath
      }
      
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
      let cleanedObject = unStringed.select((storageObject)=>{
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
  //////
  //////
  //////
  //////
  //////
  //////   wefpohfpoi;w hgilwhjlahflihi;
  //////
  //////
  completeRecording() {
    const mapper = new MidiMapper(this.midiToBeMapped)
    const dataForServer = mapper.bakeDataForParsing()
    this.sendData(dataForServer)
  }

  //TODO: make sure video file is in this object 
  findAndPrepareChannelsWithNotedata(){
    let skinnyObject = {}
    Object.keys(this.midiData).forEach((key)=>{
      let data = this.midiData[key]
      if(data["notes"] != undefined ){
        skinnyObject[key] = data
      }
    })
    return skinnyObject
  }

  sendData(data) {
    debugger
    this.findAndPrepareChannelsWithNotedata()
    const datToSendToServer = {
      metaData: this.findAndPrepareChannelsWithNotedata(),
      musicData: data 
    }
    postMidiData(datToSendToServer)
  }

}

