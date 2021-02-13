import {Controller} from "stimulus"

export default class extends Controller {
    // keyboard key is any key or all keys its a class
    static targets = ["keyBoardKey"]

    connect() {
        // instantiate a wrapper around html based data ,
        this._visibeNoteNumbersArray = new VisibleNotesArray(this.element);
        this.refreshKeyboard();
    }

    // click the octave up key
    next() {
        // if we are not at the final index, ++ our current index
        // the index is representative of our position on a piano roll
        // so 1 index = 12 notes
        if ((this.position + 1) <= this.finalIndex) {
            this.position++
        }
    }
    // !ditto
    prev() {
        if (this.position != 0) {
            this.position--
        }
    }
    // get an array of notes that should be visible on the keyboard
    get _visible_on_keyboard() {
        return this._notes[this.position].map(arr => parseInt(arr[0]))
    }

    // saved position from backend
    get position() {
        return parseInt(this.data.get("position"))
    }

    // static array of notes in the western scale, its a 2d array or an array of arrays, child arrays represent 12 semitones
    get _notes() {
        return JSON.parse(this.data.get("notes"))
    }

    // the end of the line, dont ++ past this
    get finalIndex() {
        return parseInt(this.data.get("final-index"))
    }

    // this sets the current state but also re-renders the keyboard
    set position(octave_index) {
        this.data.set("position", octave_index)
        this.refreshKeyboard(octave_index)
    }
    // for display purposes
    _get_note_number(keyElement) {
        return parseInt(keyElement.getAttribute('midi-note-number'))
    }

    // render method
    refreshKeyboard(octave_index) {
        // let visibleNoteNumbers = []
        this._visibeNoteNumbersArray.clear();
        this.keyBoardKeyTargets.forEach(key => {
            // visibleNoteNumbers.push(this._get_note_number(key))
            this.showKeyIfVisibleAndAddToVisibleNotes(key, this._get_note_number(key))
        })
    }

    showKeyIfVisibleAndAddToVisibleNotes(keyElement, noteNumber) {
        let is_in_current_array = this._visible_on_keyboard.includes(noteNumber);
        keyElement.classList.toggle("hide", !is_in_current_array);
        if(is_in_current_array){
            this._visibeNoteNumbersArray.push(noteNumber);
        }
    }

}

class VisibleNotesArray {

    constructor(element) {
        this.array = [];
        this.element = element
    }

    clear() {
        this.element.setAttribute("data-visible-note-numbers-array", JSON.stringify([]));
    }


    read() {
       return JSON.parse(this.element.getAttribute("data-visible-note-numbers-array"));
    }

    push(number){
        const currentArray = this.read();
        currentArray.push(number);
        this.element.setAttribute("data-visible-note-numbers-array", JSON.stringify(currentArray));
    }


}



