import { Controller } from "stimulus"
import WebMidi from 'webmidi'

export default class extends Controller {

  static targets = ["keyBoardKey"]

  connect() {
    this.piano = {}
    this._observe_all_keys()
    this._enable_midi()
  }

  onMessageNoteOn(msg) {
    this._play_note(msg)
    this._play_video(msg)
  }

  onMessageNoteOff(msg) {
    this._unplay_note(msg)
  }

  _play_note(msg) {
    let key = this._get_piano_key(this._get_msg_note_number(msg))
    key.classList.toggle("active", true)
  }

  _unplay_note(msg) {
    let key = this._get_piano_key(this._get_msg_note_number(msg))
    key.classList.toggle("active", false)
  }

  _play_video(msg) {
    //video......... coming soon 
  }

  ////////////////////////////////////////////////////////////////////////////////////
  /// REMINDER: this should be pulled from local storage or something user-settable //
  ////////////////////////////////////////////////////////////////////////////////////
  get _midiInput(){
    return WebMidi.inputs[0]
  }

  get _piano(){
    return this.piano
  }

  _get_piano_key(number){
    return this._piano[number]
  }

  _add_key_to_piano({noteNumber, pianoKey}) {
    this._piano[noteNumber] = pianoKey 
  }

  _get_msg_note_number(msg) {
    return msg.note.number
  }
  //////////////////////////////////////////
  /// REMINDER: DRY ME UP THIS IS A DUP   //
  //////////////////////////////////////////
  _get_note_number(keyElement) {
    return parseInt(keyElement.getAttribute('midi-note-number'))
  }

  _observe_all_keys() {
    this.keyBoardKeyTargets.forEach( keyElement => {
      this._add_key_to_piano({pianoKey: keyElement, noteNumber: this._get_note_number(keyElement)})
    })
  }

  //////////////////////////////////////////
  /// WEB MIDI SETUP:                     //
  //////////////////////////////////////////
  _enable_midi(channel){
    WebMidi.enable(error => { error ? this._on_error(error) : this._on_success(channel)  })
  }

  _on_error(error) {
    console.log(error)
    alert('Could not connect to device ☹️')
  }

  _on_success(channel="all") {
    console.log("Sysex is enabled!");
    this._midiInput.addListener('noteon', channel, msg => this.onMessageNoteOn(msg))
    this._midiInput.addListener('noteoff', channel, msg => this.onMessageNoteOff(msg))
  }
 
}






