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



export default class MidiFormScraper {
    constructor() {
        this.midiToBeMapped = [];
        this.midiData = {
            "0":[],
            "1":[],
            "2":[],
            "3":[],
            "4":[],
            "5":[],
            "6":[],
            "7":[],
            "8":[],
            "9":[],
            "10":[]
        }
    }

    commitState(stateSnapshot){
    }

    startMidi = () => {
        navigator.requestMIDIAccess().then( access => {
          //there should really only be one here, but you never know 
          console.log(access.inputs);
          const devices = access.inputs.values();
          for (let device of devices ) {

            if (device.name == "OP-Z") {
              console.log(device.name)
              device.onmidimessage = this.onMidiMessage //keep
              device.onstatechange = this.handleOPZChange //change to have msg sent when we hit stop button 
            
            }

          }
        }).catch(console.error);
    }

    onMidiMessage = (message) => {
      //message data 0 is telling us if we are an off or on channel and which channel (1 - 16) at the same time 
      console.log(message.data[0].toString())
      console.log(message.timeStamp)
      //if its an on channel or off, its relevant, so commit it to the json 
      if ((ON_CHANNELS[message.data[0].toString()] != undefined) || (OFF_CHANNELS[message.data[0].toString()] != undefined)) {
        
        //prepare the event to be processed
        let stringedData = []
        message.data.forEach((d)=>{stringedData.push(d.toString())})
        let obj = {
          data: stringedData,
          timeStamp: message.timeStamp
        }

        this.midiToBeMapped.push(obj)

        console.log("midi " +this.timeOfFirstMidiNote )
        if(this.firstNote == true){
          this.timeOfFirstMidiNote = Date.now()
          console.log("first midi " +this.timeOfFirstMidiNote )

          // this.setupAndBeginRecording()  
        } 
         this.firstNote = false 
        //here we push into an unprocessed array, we shall return to this in a while
        // this.channelsAndStamps.push({"noteChannel": message.data[0], "timeStamp": message.timeStamp })
      } 
    }

    
    
}

