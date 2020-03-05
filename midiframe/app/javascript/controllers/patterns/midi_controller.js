// src/controllers/slideshow_controller.js
import { Controller } from "stimulus"

export default class extends Controller {

  static targets = ["keyBoardKey"]


  next() {
    // avoid index out of bounds 
    if(( this.position + 1 ) <= this.finalIndex) {
      this.position++
    }
  }

  prev() {
    // avoid index out of bounds 
    if( this.position != 0) {
      this.position--
    }
  }

  showCurrentkeyRange() {
    this.keyBoardKeyTargets.forEach((el, i) => {
      
      let isInCurrentArr = this.notes[this.position].includes(parseInt(el.getAttribute('midi-note-number')))
      //remove hide class if li is in range 
      debugger 
      el.classList.toggle("hide", !isInCurrentArr)
    })
  }

  get position() {
    return parseInt(this.data.get("position"))
  }

  set position(value) {
    this.data.set("position", value)
    this.showCurrentkeyRange()
  }

  get notes() {
    return JSON.parse(this.data.get("notes"))
  }

  get finalIndex() {
    return parseInt(this.data.get("final-index"))
  }
  
}