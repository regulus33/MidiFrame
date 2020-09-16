import { Controller } from "stimulus"

export default class extends Controller {

  static targets = ["keyBoardKey"]

  connect(){
    this._visibeNoteNumbersArray = [];
    this.refreshKeyboard();
  }

  ///////////////////////////////////////////
  ///               PUBLIC                ///
  ///////////////////////////////////////////
  next() {
    console.log('next')
    if ((this.position + 1) <= this.finalIndex) {
      this.position++
    }
  }

  prev() {
    if (this.position != 0) {
      this.position--
    }
  }

  get visiblesNoteNumbersArray() {
    return JSON.parse(this.element.getAttribute("data-visible-note-numbers-array"));
  }

  set visiblesNoteNumbersArray(notes){
    this.element.setAttribute("data-visible-note-numbers-array", notes);
  }

  get _visible_on_keyboard() {
    return this._notes[this.position].map(arr => parseInt(arr[0]))
  }

  get position() {
    return parseInt(this.data.get("position"))
  }

  get _notes() {
    return JSON.parse(this.data.get("notes"))
  }

  get finalIndex() {
    return parseInt(this.data.get("final-index"))
  }

  set position(value) {
    this.data.set("position", value)
    this.refreshKeyboard()
  }

  _get_note_number(keyElement) {
    return parseInt(keyElement.getAttribute('midi-note-number'))
  }

  refreshKeyboard() {
    this.keyBoardKeyTargets.forEach(key => this._show_key_if_visible_and_add_to_visibles(key, this._get_note_number(key)));
    this.visiblesNoteNumbersArray = JSON.stringify(this._visibeNoteNumbersArray);
  }

  _show_key_if_visible_and_add_to_visibles(keyElement, noteNumber) {
    let is_in_current_array = this._visible_on_keyboard.includes(noteNumber);
    let visibles = [];
    keyElement.classList.toggle("hide", !is_in_current_array);
    if(is_in_current_array) this._visibeNoteNumbersArray.push(noteNumber);
  }

}



