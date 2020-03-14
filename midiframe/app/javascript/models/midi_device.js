import WebMidi from 'webmidi'
import M from 'materialize-css'

export default class MidiDevice {
  
  constructor(){
    this.connectToDevice()
    this.logAllNoteOn()
  }

  connectToDevice() {
    WebMidi.enable(function (err) {
      if (err) {  
        M.toast( { html:'yup'} )
      } else {
        console.log("Sysex is enabled!");
      }
    }, true);
  }

  logAllNoteOn() {
    input.addListener('noteon', "all",
    function (e) {
      console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
    })
  }
 



  

  
}