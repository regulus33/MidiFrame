import { Controller } from "stimulus"

export default class extends Controller {

  static targets = ["keyBoardKey"]

  ///////////////////////////////////////////
  ///               PUBLIC                ///
  ///////////////////////////////////////////
  next() {
    if ((this._position + 1) <= this.finalIndex) {
      this._position++
    }
  }

  prev() {
    if (this._position != 0) {
      this._position--
    }
  }

  ///////////////////////////////////////////
  ///              PRIVATE                ///
  ///////////////////////////////////////////
  get _visible_on_keyboard() {
    return this._notes[this._position].map(arr => parseInt(arr[0]))
  }

  get _position() {
    return parseInt(this.data.get("position"))
  }

  get _notes() {
    return JSON.parse(this.data.get("notes"))
  }

  get finalIndex() {
    return parseInt(this.data.get("final-index"))
  }

  set _position(value) {
    this.data.set("position", value)
    this._refresh_keyboard()
  }

  _get_note_number(keyElement) {
    return parseInt(keyElement.getAttribute('midi-note-number'))
  }

  _refresh_keyboard() {
    this.keyBoardKeyTargets.forEach(key => this._show_key_if_visible(key, this._get_note_number(key)))
  }

  _show_key_if_visible(keyElement, noteNumber) {
    let is_in_current_array = this._visible_on_keyboard.includes(noteNumber)
    keyElement.classList.toggle("hide", !is_in_current_array)
  }


}



