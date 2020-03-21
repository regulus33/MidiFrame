import { Controller } from "stimulus"
import WebMidi from 'webmidi'
import videojs from 'video.js'
import { toTheNearestThousandth, randoMize } from '../../helpers/math'
import { NUDGE_AMOUNT } from '../../helpers/constants'

export default class extends Controller {

  static targets = ["keyBoardKey", "video"]

  connect() {
    // * a slimmed down version of piano { 35: <PianoKeyHtml/> }
    // ? primary used to store references of the keys to update with highlights, avoiding re-queries 
    this.piano = {}
    // * a slimmed down version of piano { 35: 3456 }
    // ? just the data 
    this.pianoData = {}
    
    this.video = videojs(this.videoTarget.id)

    this.selectedKey = null 

    this._observe_all_keys()
   
    this._enable_midi() 
   
    this._onVideoSeek = this.updateSelectedNoteTime.bind(this)

  }

  ///////////////////////////////////////////
  // *PUBLIC Event Listener Callbacks  
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

  updateSelectedNoteTime(event) {

    let filteredTime = toTheNearestThousandth( event.target.player.currentTime() )
    if(this._selectedKey) {
      this.updateData({time: filteredTime, number: event.target.id})
      this._selectedKey.value = filteredTime
    }
  }
  
  // ? needs to be refactored 
  // 1. from seeking in the video 
  // 2. nudging the timestamp back  
  // 3. nudging the timestamp fourth   
  // 4. randomizing   
  // TODO find a way to simplify this duplication  
  updateData({time, number}){
    this.pianoData[number] = time 
    console.log(this.pianoData)
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

  get _midiInput(){
    return WebMidi.inputs[0]
  }

  get _piano(){
    return this.piano
  }


  get _videoLength(){
    return this._video.duration()
  }

  _numericalValue(str) {
    return toTheNearestThousandth( parseFloat(str) )
  }

  _nudgeTimeRight(element){
    let time = this._numericalValue(element.value)
    time += NUDGE_AMOUNT
    time = toTheNearestThousandth(time) 
    this.updateData({time: time, number: element.id})
    element.value = time 
  }

  _nudgeTimeLeft(element) {
    let time = this._numericalValue(element.value)
    let nextTime = toTheNearestThousandth(time - NUDGE_AMOUNT)
    time = nextTime < 0 ? 0 : nextTime
    this.updateData({time: time, number: element.id})
    element.value = time 
  }

  _randomize(element){
    let randomValue = randoMize(this._videoLength)
    this.updateData({time: randomValue, number: element.id})
    element.value = randomValue 
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

  _activatePianoKey(element){
    element.parentElement.classList.add("selected")
  }

  _deactivatePianoKey(element){
    this.selectedKey.parentElement.classList.remove("selected")
    
  }

  _deletePianoKey(){
    this.selectedKey = null 
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


