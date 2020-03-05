import { Controller } from "stimulus"

import { requestMidiAccessFromChrome } from "midi"

export default class extends Controller {
   
  //TODO this is most likely not working, needs testing 
  getPermission() {
    this.requestMidiAccessFromChrome() 
  }

}