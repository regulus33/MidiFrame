import { Controller } from "stimulus"

import { requestMidiAccessFromChrome } from "shared_midi_utilities"

export default class extends Controller {
   
  //TODO this is most likely not working, needs testing 
  getPermission() {
    this.requestMidiAccessFromChrome() 
  }

}