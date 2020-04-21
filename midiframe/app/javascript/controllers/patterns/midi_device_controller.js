import { Controller } from "stimulus"
import WebMidi from 'webmidi'
import videojs from 'video.js'
import { toTheNearestThousandth, randoMize } from '../../helpers/math'
import { NUDGE_AMOUNT, baseUrl } from '../../helpers/constants'
import { saveProject, generatePatternClip } from '../../helpers/network'

export default class extends Controller {

  static targets = ["keyBoardKey", "video", "channel", "patternId", "projectId", "settings", "recordButton", "noteStamps"]

  connect() {
    this.piano = {}
    this.pianoData = {}
    this.recordingSessionOpen = false 
    this.recording = false 
    this.midiEvents = [] 
    this.startingTime = null 
    this.clockSignalsPassedSinceRecordStart = 0 
    this.video = videojs(this.videoTarget.id)
    this.selectedKey = null 
    this._observe_all_keys()
    this._enable_midi() 
    this._onVideoSeek = this.updateSelectedNoteTime.bind(this)
    this.saveAndNavigate = this.saveAndNavigate.bind(this)
    this._addKeyDownChannelListener()
    this._initializePianoData()
  }

  //SAVE BUTTON 
  save() {
    return saveProject({channel: this._channel, pianoData: this.pianoData, midiEvents: this.midiEvents, patternId: this._getPatternId(), projectId: this._getProjectId()})
    .then(() => { 
      M.toast( { html:'Pattern Saved'})
      // ? if the midi events are at the server, there is no reason for them to 
      // ? hang around in memory, clear the array in preparation for new recordings 
      this._clearMidiEvents()
    })
  }

  saveAndNavigate() {
    // console.log(this._settingsUrl)
    this.save().then(() => { 
      // console.log(this._settingsUrl)
      window.location.href = baseUrl + this._settingsUrl
    })
  }


  //? submitting data to be converted into a video 
  generatePatternClip(){
    // ! save before we tell controller to generate 
    this.save().then((e) => {
      generatePatternClip({patternId: this._getPatternId(), projectId: this._getProjectId()}).then(()=> {
      })
    })
  }

  onMessageClock(message) {
    // ? only count clock signals if recording 
    if(this._recording) {
      debugger 
      this.clockSignalsPassedSinceRecordStart++
      console.log(`clock signal passed: ${this.clockSignalsPassedSinceRecordStart} total clock signals: ${this._totaClockSignals}`)
      switch(this.clockSignalsPassedSinceRecordStart) {
        // ! end is reached! exit recording loop
        case this._totaClockSignals:
          this._addStopTime(message.timestamp)
          this._recording = false 
          this._resetClock()
          this.toggleRecordingSession()
          break;
      }
    } 
  }

  onMessageNoteOn(msg) {
    this._play_note(msg)
    this._play_video(msg)
    this._addMidiEvent(msg)
  }

  onMessageNoteOff(msg) {
    this._unplay_note(msg)
  }

  onMessageStart(msg) {
    this._addStartEvent(msg.timestamp)
    if(this._recordingSessionOpen) {
      this._startRecordingMidiNotes()
    }
  }

  onPianoKeyClick(event){
    this._shouldSelectNote(event.target) ? this._selectNote() : this._unselectNote()
  }

  updateSelectedNoteTime(event) {
    // ?exit immediately if we are playing midi, user is not allowed to timestamp drag in that state. 
    if(this._playing) return 
    let filteredTime = toTheNearestThousandth( event.target.player.currentTime() )
    if(this._selectedKey) {
     
      this._updateData({time: filteredTime, number: this._selectedKey.id })
      this._selectedKey.value = filteredTime
    }
  }
  
  onDocumentKeyDown(e) {
    if(this._keyCodeIsNumber(e.key))  this._changeChannel(e.key)
  }

  onFormKeyDown(e) {
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

  toggleRecordingSession() {
    this._recordingSessionOpen = !this._recordingSessionOpen 
    M.toast( { html: `recording session ${this._recordingSessionOpen ? 'open' : 'closed'}`} ) 
  }
  
  // **************************************************
  // ! PRIVATE METHODS PRIVATE METHODS PRIVATE METHODS
  // *************************************************

  _clearMidiEvents() {
    this._midiEvents = []
  }

  _resetClock() {
    this.clockSignalsPassedSinceRecordStart = 0 
  }

  _startRecordingMidiNotes() {
    this._recording = true 
  }

  _updateData({time, number}) {
    this.pianoData[number] = time 
  }

  // TODO: i think the object may need data to be converted i.e. integers 
  _initializePianoData() {
    let noteStamps = JSON.parse(this.noteStampsTarget.getAttribute("note-stamps"))
    if(noteStamps){
      this.pianoData = noteStamps
    }
  }

  _addKeyDownChannelListener() {
    window.addEventListener('keydown', this.onDocumentKeyDown.bind(this))
  }

  _changeChannel(channel) {
    this._channel = channel
    this._resetMidiListeners(parseInt(channel))
  }

  _keyCodeIsNumber(code) {
    return [1,2,3,4,5,6,7,8,9].includes(parseInt(code))
  }

  _numericalValue(str) {
    return toTheNearestThousandth( parseFloat(str) )
  }

  _nudgeTimeRight(element){
    let time = this._numericalValue(element.value)
    time += NUDGE_AMOUNT
    time = toTheNearestThousandth(time) 
    this._updateData({time: time, number: element.id})
    element.value = time 
  }

  _nudgeTimeLeft(element) {
    let time = this._numericalValue(element.value)
    let nextTime = toTheNearestThousandth(time - NUDGE_AMOUNT)
    time = nextTime < 0 ? 0 : nextTime
    this._updateData({time: time, number: element.id})
    element.value = time 
  }

  // ? RECORDING SESSION 
  get _recordingSessionOpen() {
    return this.recordingSessionOpen
  }

  set _recordingSessionOpen(isOpen) {
    this.recordingSessionOpen = isOpen
    this.recordButtonTarget.classList.toggle('open-recording-session')
  }

  _randomize(element){
    let randomValue = randoMize(this._videoLength)
    this._updateData({time: randomValue, number: element.id})
    element.value = randomValue 
  } 

  _shouldSelectNote(element){
    return this._selectedKey && this._selectedKey.id == element.id ? false : true 
  }

  _selectNote(){
    this._selectedKey = event.target 
    this._selectedKey.addEventListener('keydown', (e) => { this.onFormKeyDown(e) })
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
    if(this.pianoData[msg.note.number]){
      this._video.currentTime(this.pianoData[msg.note.number])
    }
  }

  _activatePianoKey(element) {
    element.parentElement.classList.add("selected")
  }

  _deactivatePianoKey() {
    this.selectedKey.parentElement.classList.remove("selected")
  }

  _deletePianoKey() {
    this.selectedKey = null 
  }

  _get_piano_key(number) {
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
  _enable_midi(channel) {
    WebMidi.enable(error => { error ? this._on_error(error) : this._on_success(channel)  })
  }

  _on_error(error) {
    // console.log(error)
    alert('Could not connect to device ☹️')
  }

  _wipeListeners() {
    this._midiInput.removeListener('noteon')
    this._midiInput.removeListener('noteoff')
  }

  _resetMidiListeners(channel) {
    this._wipeListeners()
    this._on_success(channel)
  }

  _setPlaying() {
    this.channelTarget.style.color = "#f3ff85"
    this._hideControlBar()
    this._playing = true 
  }

  _setStopping() {
    this.channelTarget.style.color = "white"
    this._showControlBar()
    this._playing = false
  }

  _hideControlBar() {
    this._video.controlBar.hide()
  }

  _showControlBar() {
    this._video.controlBar.show()
  }

  _setPlayAndStopListeners() {
    this._midiInput.addListener('stop', 'all', this._setStopping.bind(this))
    this._midiInput.addListener('start', 'all', this._setPlaying.bind(this))
  }

  _on_success(channel) {
    // ? just for knowing if midi is being received or not
    this._setPlayAndStopListeners()
    ///////
    this._midiInput.addListener('noteon', channel, msg => this.onMessageNoteOn(msg))
    this._midiInput.addListener('noteoff', channel, msg => this.onMessageNoteOff(msg))
    this._midiInput.addListener('clock', "all", this.onMessageClock.bind(this))
    this._midiInput.addListener('start', "all", this.onMessageStart.bind(this))
  }

  _getPatternId() {
    return this.patternIdTarget.getAttribute("pattern-id")
  }

  _getProjectId() {
    return this.projectIdTarget.getAttribute("project-id")
  }

  _stopMidi(){
    this._midiOutput.sendStop()
  }

  _addStartEvent(timestamp) {
    // ? on first clock signal of recording session we get the received time of the 
    // ? first note 
    let processeableEvent = { note: "start", timestamp: timestamp }
    this._midiEvents.push(processeableEvent)
  }

  _addStopTime(timestamp) {
    let processeableEvent = { note: "stop", timestamp: timestamp }
    this._midiEvents.push(processeableEvent)
  }
  
  _addMidiEvent(event) {
    let calibratedTimeStamp 
    // ? first you need to get the amount of time to subtract from each timestamp so that the first evetn starts at 0:00
    // ? set the timing in the new event  
    if(this._recording) {
      let processeableEvent = { note: event.note.number, timestamp: event.timestamp }
      this._midiEvents.push(processeableEvent)
    }
  }
  
  // **************************************************************
  // ******************* GETTERS AND SETTERS **********************
  // **************************************************************
  
  // ? CHANNEL
  // ? we get it from the document, it is save in the pattern 
  ///////////////////////////////////////////////////////////////////
  get _channel(){
    return parseInt(this.channelTarget.getAttribute('device-channel'))
  }
  set _channel(channel) {
    this.channelTarget.innerHTML = channel 
    this.channelTarget.setAttribute('device-channel', channel)
  }
  ///////////////////////////
  get _midiEvents() {
    return this.midiEvents
  }

  set _midiEvents(events) {
    this.midiEvents = events
  }
  ///////////////////////////
  get _midiInput(){
    return WebMidi.inputs[0]
  }

  get _midiOutput(){
    return WebMidi.outputs[0]
  }

  get _piano(){
    return this.piano
  }

  // ? PLAYING we use this to light up channel, to notify forms to ignore playhead's value 
  // ? and probably a multitude of other things as new requirements emerge. 
  /////////////////////////
  get _playing(){
    return this.playing
  }

  set _playing(playing){
    this.playing = playing
  }
  /////////////////////////

  // ? RECORDING 
  // ? the SETTER has extrac functionality tied to it 
  // ? that extra functionality is key to capturing midi events
  // ? when we are in a record loop  
  ///////////////////////////////////////////////////////////////////////
  get _recording() {
    return this.recording 
  }
  // ? set recording AND also stop or start midi based on value of 'recording'
  set _recording(recording) {
    if(recording) {
      this.recording = true
    } else {
      this.recording = false 
      this._stopMidi()
    }
  }
  ////////////////////////////////////////////////////////////////////////
  // ? SELECTED KEY 
  // ? get the key (form input) that we need to change the time on 
  get _selectedKey() {
    return this.selectedKey
  }
  // ? set the key we will be performing for input changes on 
  set _selectedKey(element){
    if(this.selectedKey) {
      this._deactivatePianoKey(this.selectedKey)
    } 
    this._activatePianoKey(element)
    this.selectedKey = element
  }
  //////////////////////////////////////////////////////
  // ? which url to navigate to update pattern 
  get _settingsUrl(){
    return this.settingsTarget.getAttribute("nav-url")
  }
  
  // ? pre-calculated (on server side) total clock signals before a record session ends 
  get _totaClockSignals() {
    return parseInt(this.recordButtonTarget.getAttribute("total-clock-signals"))
  }

  // ? return the video element 
  get _video(){
    return this.video 
  }

  // ? used to calculate a random timestamp within video length range 
  get _videoLength(){
    return this._video.duration()
  }

  // ? set the function that will run on video seek, right now it updates the form 
  set _onVideoSeek(fun){
    this._video.on('seeking', (e) => fun(e))
  }

}


