import { Controller } from "stimulus"

import { requestMidiAccessFromChrome } from "midi"

export default class extends Controller {
    connect(){
        debugger 
    }
  getPermission() {
    this.requestMidiAccessFromChrome() 
  }

}