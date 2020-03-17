import WebMidi from 'webmidi'
import Keyboard from './keyboard'

export default class MidiDevice {
  
  // singleton
  constructor({channel, eventHandler}) {
    this._connectToDevice({channel: channel, eventHandler: eventHandler})

    if(this.instance) {
      return this.instance
    }
    this.instance = this
  }

  get keyboard() {
    this.keyboard
  }
  // this will change when we let the user select their device 
  get input() {
   return WebMidi.inputs[0]
  }

  _connectToDevice({channel, eventHandler}) {
    return WebMidi.enable( error=> this._onRequestConnectionResponse({ error, eventHandler, channel }), true)
  }





 



  

  
}