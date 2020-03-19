import { Controller } from "stimulus"
import WebMidi from 'webmidi'
import videojs from 'video.js'
import { toTheNearestThousandth, randoMize } from '../../helpers/math'
import { NUDGE_AMOUNT } from '../../helpers/constants'

export default class extends Controller {

  static targets = ["keyBoardKey", "video"]

  connect() {
    this.piano = {}
    
    this.video = videojs(this.videoTarget.id)

    this.selectedKey = null 

    this._observe_all_keys()
   
    this._enable_midi() 
   
    this._onVideoSeek = this.updateSelectedNoteTime.bind(this)

  }

  //////////////////////////////////////////
  /// PUBLIC/EVENT LISTENERS 
  ///////////////////////////////////////////

  onMessageNoteOn(msg) {
    this._play_note(msg)
    this._play_video(msg)
  }

  onMessageNoteOff(msg) {
    this._unplay_note(msg)
  }

  onPianoKeyClick(event){
    this._shouldSelectNote(event.target) ? this._selectNote() : this._unselectNote()
  }

  updateSelectedNoteTime(event){
    if(this._selectedKey) {
      this._selectedKey.value = event.target.player.currentTime()
    }
  }

  onKeyDown(e) {
      e.preventDefault()
      switch(e.key) {
        case "]":
          this._nudgeTimeRight(e.target)
          break
        case "[":
          this._nudgeTimeLeft(e.target)
          break
        case "r":
          this._randomize(e.target) 
      }
  }

  ///////////////////////////////////////////
  /// PRIVATE 
  ///////////////////////////////////////////

  _nudgeTimeRight(element){
    debugger 
    let time = this._numericalValue(element.value)
    time += NUDGE_AMOUNT
    element.value = toTheNearestThousandth(time) 
  }

  _nudgeTimeLeft(element) {
    let time = this._numericalValue(element.value)
    time -= NUDGE_AMOUNT
    element.value = toTheNearestThousandth(time) 
  }

  _randomize(element){
    let newVal = randoMize(this._videoLength)
    element.value = newVal 
  } 

  get _videoLength(){
    return this._video.duration()
  }

  _numericalValue(str) {
    return toTheNearestThousandth( parseFloat(str) )
  }

  _shouldSelectNote(element){
    return this._selectedKey && this._selectedKey.id == element.id ? false : true 
  }

  _selectNote(){
    this._selectedKey = event.target 
    this._selectedKey.addEventListener('keydown', (e) => { this.onKeyDown(e) })
  }

  _unselectNote(){
    this._deactivatePianoKey(this._selectedKey)
    this._deletePianoKey()
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
    //jump to time 
  }

  set _onVideoSeek(fun){
    this._video.on('seeking', (e) => fun(e))
  }

  set _selectedKey(element){
    if(this.selectedKey) {
      this._deactivatePianoKey(this.selectedKey)
    } 
    this._activatePianoKey(element)
    this.selectedKey = element
  }

  get _selectedKey() {
    return this.selectedKey
  }

  get _video(){
    return this.video 
  }

  _activatePianoKey(element){
    element.parentElement.classList.add("selected")
  }

  _deactivatePianoKey(element){
    this.selectedKey.parentElement.classList.remove("selected")
  }

  _deletePianoKey(){
    this.selectedKey = null 
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
    // this._midiInput.addListener('noteon', channel, msg => this.onMessageNoteOn(msg))
    // this._midiInput.addListener('noteoff', channel, msg => this.onMessageNoteOff(msg))
  }

 
}






