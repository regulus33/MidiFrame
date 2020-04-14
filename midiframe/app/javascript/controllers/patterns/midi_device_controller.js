import { Controller } from "stimulus"
import WebMidi from 'webmidi'
import videojs from 'video.js'
import { toTheNearestThousandth, randoMize } from '../../helpers/math'
import { NUDGE_AMOUNT, baseUrl } from '../../helpers/constants'
import { saveProject, generatePatternClip } from '../../helpers/network'

export default class extends Controller {

  static targets = ["keyBoardKey", "video", "channel", "patternId", "projectId", "settings", "recordButton", "noteStamps"]

  connect() {

    // * a slimmed down version of piano { 35: <PianoKeyHtml/> }
    // ? primary used to store references of the keys to update with highlights, avoiding re-queries 
    // * {35: <pianokey alt="derk"/> } 
    this.piano = {}
    // * a slimmed down version of piano { 35: 3456 }
    // ? just the notes used and the timestamps they should trigger in the video 
    // * {36: 5666} (note number: video timestamp)
    this.pianoData = {}
    
    // ? keep track of the notes that come out of the device. 
    // * [{note: 60, timestamp: 3}]
    this.midiEvents= [] 

    this.recording = false 

    this.startingTime = null 

    this.clockSignalsPassedSinceRecordStart = 0 

    this.video = videojs(this.videoTarget.id)

    this.selectedKey = null 

    this._observe_all_keys()
   
    this._enable_midi() 
   
    this._onVideoSeek = this.updateSelectedNoteTime.bind(this)

    this.saveAndNavigate = this.saveAndNavigate.bind(this)

    this._addKeyDownChannelListener()

    // * INITIALIZING PIANO DATA IF IN THE DOM 
    this._initializePianoData()

  }

  /*
  * @param web midi message api object
  * runs whatever needs ot happen on midi message
  */
  onMessageNoteOn(msg) {
    this._play_note(msg)
    this._play_video(msg)
    this._addMidiEvent(msg)
  }

  onMessageNoteOff(msg) {
    this._unplay_note(msg)
  }

  onPianoKeyClick(event){
    this._shouldSelectNote(event.target) ? this._selectNote() : this._unselectNote()
  }

  updateSelectedNoteTime(event) {
    // ?exit immediately if we are playing midi, user is not allowed to timestamp drag in that state. 
    if(this._playing) return 
    let filteredTime = toTheNearestThousandth( event.target.player.currentTime() )
    if(this._selectedKey) {
     
      this.updateData({time: filteredTime, number: this._selectedKey.id })
      this._selectedKey.value = filteredTime
    }
  }
  
  // ? needs to be refactored 
  // 1. from seeking in the video 
  // 2. nudging the timestamp back  
  // 3. nudging the timestamp fourth   
  // 4. randomizing
  // TODO find a way to simplify this duplication  
  updateData({time, number}) {
    this.pianoData[number] = time 
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

  // TODO: i think the object may need data to be converted i.e. integers 
  _initializePianoData(){
    let noteStamps = JSON.parse(this.noteStampsTarget.getAttribute("note-stamps"))
    if(noteStamps){
      this.pianoData = noteStamps
    }

  }

  get _playing(){
    return this.playing
  }

  set _playing(playing){
    this.playing = playing
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

  get _midiOutput(){
    return WebMidi.outputs[0]
  }

  get _piano(){
    return this.piano
  }


  get _videoLength(){
    return this._video.duration()
  }

  get _channel(){
    return parseInt(this.channelTarget.getAttribute('device-channel'))
  }

  set _channel(channel) {
    this.channelTarget.innerHTML = channel 
    this.channelTarget.setAttribute('device-channel', channel)
  }

  _addKeyDownChannelListener(){
    window.addEventListener('keydown', this.onDocumentKeyDown.bind(this))
  }

  _changeChannel(channel){
    this._channel = channel
    this._resetMidiListeners(parseInt(channel))
  }

  _keyCodeIsNumber(code){
    return [1,2,3,4,5,6,7,8,9].includes(parseInt(code))
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
  }

  //SAVE BUTTON 
  save() {
    // console.log(this._getPatternId())
    // console.log(this._getProjectId())
    return saveProject({channel: this._channel, pianoData: this.pianoData, midiEvents: this.midiEvents, patternId: this._getPatternId(), projectId: this._getProjectId()})
    .then(() =>  M.toast( { html:'Pattern Saved'} ) )
  }

  saveAndNavigate() {
    // console.log(this.settingsUrl)
    this.save().then(() => { 
      // console.log(this.settingsUrl)
      window.location.href = baseUrl + this.settingsUrl
    })
  }

  get settingsUrl(){
    return this.settingsTarget.getAttribute("nav-url")
  }

  _getPatternId() {
    return this.patternIdTarget.getAttribute("pattern-id")
  }

  _getProjectId() {
    return this.projectIdTarget.getAttribute("project-id")
  }

  //Midi Event Collection  Methods 
  // setter and getter methods for midi events collection
  
  get _midiEvents() {
    return this.midiEvents
  }

  startRecordingMidiNotes() {
    // ? start playing
    // * turn recording on 
    // * increment clock signals in another process 
    // * soon as clock signals reaches this.data.get("total-clock-signals") hits, exit by setting recording to false and
    // * meanwhile, we only push data into array if recording is true    
    //! recording also starts the midi when set to true
    this._recording = true 

  }

  // ! HEADS UP:::::: there are two parts to this process, this only determines when to end recording time........
  // ! SEE ON MESSAGE NOTE ON for the bit that saves data into an array to send to server  
  // ? you need to increment the clock signals count(clock signals passed since record start), dont worry! It will be reset when recording stops 
  onMessageClock(message) {
    // ? only count clock signals if recording 
    if(this._recording) {

      this.clockSignalsPassedSinceRecordStart++
      console.log(`clock signal passed: ${this.clockSignalsPassedSinceRecordStart} total clock signals: ${this._totaClockSignals}`)
      
      switch(this.clockSignalsPassedSinceRecordStart) {
        // ! end is reached! exit recording loop
        case this._totaClockSignals:
          this._addStopTime(message.timestamp)
          this._recording = false 
          break;
        case 1:
          this._addStartEventAndSetStartTime(message.timestamp)
          break;
      }

   

    } 
  }

  // ? set recording AND also stop or start midi based on value of 'recording'
  set _recording(recording) {
    if(recording) {
      this.recording = true
      this._startMidi()
    } else {
      this.recording = false 
      this._stopMidi()
      // this._resetStartTime()
    }
  }

  get _recording() {
    return this.recording 
  }

  _startMidi(){
    this._midiOutput.sendStart()
  }

  _stopMidi(){
    this._midiOutput.sendStop()
  }

  _calibrateTiming(timestamp, startingTime) {
    return timestamp - startingTime 
  }

  get _totaClockSignals() {
    return parseInt(this.recordButtonTarget.getAttribute("total-clock-signals"))
  }

  _addStartEventAndSetStartTime(timestamp) {
    // ? on first clock signal of recording session we get the received time of the 
    // ? first note 
   
    this._startingTime = timestamp
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
    // if(this._midiEvents.length == 0) {
    //   this._startingTime = event.timestamp
    // }
    // ? set the timing in the new event  
    // calibratedTimeStamp = this._calibrateTiming(event.timestamp, this._startingTime)
    
    if(this._recording) {
      let processeableEvent = { note: event.note.number, timestamp: event.timestamp }
      this._midiEvents.push(processeableEvent)
    }
  }

  get _startingTime(){
    return this.startingTime 
  }

  set _startingTime(time){
    this.startingTime = time
  }

  // ? this isnt necessary but clarifies that a new start time will be created for every new recording session
  resetStartTime() {
    this.startingTime = 0 
  }


  //? submitting data to be converted into a video 
  generatePatternClip(){
    // ! save before we tell controller to generate 
    this.save().then((e) => {
      debugger
      generatePatternClip({patternId: this._getPatternId(), projectId: this._getProjectId()}).then(()=> {
        debugger 
      })
    })
  }
  

}


