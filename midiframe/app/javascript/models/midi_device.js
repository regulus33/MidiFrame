import WebMidi from 'webmidi'
import M from 'materialize-css'

export default class MidiDevice {
  
  constructor(){
    this.connectToDevice()
  }

  get input(){
   return WebMidi.inputs[0]
  }

  connectToDevice() {
    return WebMidi.enable(function (err) {
      if (err) {  
        
        
      } else {
        
        let input = WebMidi.inputs[0]
        input.addListener('noteon', "all",
        function (e) {
          console.log( "'" + e.note.name + e.note.octave + "'" + ",");
        })

        console.log("Sysex is enabled!");
      }
    }, true);
  }

  logAllNoteOn() {
   
  }
 



  

  
}