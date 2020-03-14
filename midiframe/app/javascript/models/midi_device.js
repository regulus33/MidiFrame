import WebMidi from 'webmidi'
import M from 'materialize-css'

export default class MidiDevice {
  
  constructor() {
    this.connectToDevice()
  }

  get input() {
   return WebMidi.inputs[0]
  }

  onNotePress(e) {
    debugger
  }

  connectToDevice(channel) {
    return WebMidi.enable(error=>this.setup({channel, error}),true);
  }

  setup({channel, error}) {
    if (error) {  
      alert('Could not connect to device')
    } else {
      this.input.addListener('noteon', channel, event=>this.onNotePress(event))
      console.log("Sysex is enabled!");
    }
  }



 



  

  
}