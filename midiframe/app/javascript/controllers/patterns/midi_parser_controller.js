import { Controller } from "stimulus"

export default class extends Controller {

  static targets = ['midiFile']

  async connect() { 
      console.log('connected'); 
  }
  onFilePick() {
    console.log("file picked");
 } 
}