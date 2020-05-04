import { Controller } from "stimulus"
import WebMidi from 'webmidi'
import videojs from 'video.js'
import { toTheNearestThousandth, randoMize } from '../../helpers/math'
import { NUDGE_AMOUNT, baseUrl } from '../../helpers/constants'
import { saveProject, generatePatternClip } from '../../helpers/network'

export default class extends Controller {

  static targets = [
  "keyBoardKey",
   "video",
   "channel",
   "patternId",
   "projectId",
   "settings",
   "recordButton",
   "noteStamps",
   "buttonMinus",
   "buttonPlus",
   "saveCurrentTime",
   "addTextButton",
   "textModalTitle",
   "noteText",
   "inputValue"
  ]

  connect() {
    this.piano = {};
    this.pianoData = {};
    this.pianoTextData = {};
    this.recordingSessionOpen = false; 
    this.recording = false; 
    this.midiEvents = []; 
    this.startingTime = null; 
    this.clockSignalsPassedSinceRecordStart = 0; 
    this.video = videojs(this.videoTarget.id);
    this.selectedKey = null;
    this._observe_all_keys();
    this._enable_midi();
    this.saveAndNavigate = this.saveAndNavigate.bind(this);
    this._addKeyDownChannelListener();
    this._initializePianoData();
    //everytime a new notes comes in we will add it 
    this.playedNotes = new Set();
    this.isSeeking = false;
    this.positionTextForVideo();
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
    this.onOnHighlightingRelevantOctaveButton(msg)
    this._addMidiNoteToPlayedNotes(msg) // ? save the notes for global randomize 
    this._playText(msg)
  }

  onMessageNoteOff(msg) {
    this._unplay_note(msg)
    this.onOffHighlightingRelevantOctaveButton(msg)
  }

  //? this method adds the starting timestamp (its the most precise way)
  //? and begins adding new midi events to the collection  
  onMessageStart(msg) {
    if(this._recordingSessionOpen) {
      this._addStartEvent(msg.timestamp)
      this._startRecordingMidiNotes()
    }
    this.playVideo();
  }

  onMessageStop(){
    this.stopVideo();
  }

  playVideo(){
    this._video.play();
  }

  stopVideo(){
    this._video.pause();
  }

  onPianoKeyClick(event){
    this._shouldSelectNote(event.target) ? this._selectNote() : this._unselectNote()
  }

  updateSelectedNoteTime(event) {
    // ?exit immediately if we are playing midi, user is not allowed to timestamp drag in that state. 
    // if(this._playing) return 
    // if user is not actively seeking return, we are just playing midi notes and calling this because seeking is 
    // triggered when currentTime = is used 
    if(!this._isSeeking) return 
    let filteredTime = toTheNearestThousandth( event.target.player.currentTime() )
    if(this._selectedKey) {
     
      this._updateData({time: filteredTime, number: this._selectedKey.id })
      this._selectedKey.value = filteredTime
    }
  }

  onDocumentKeyDown(e) {
    if(this._keyCodeIsNumber(e.key))  this._changeChannel(e.key);
    if(e.key === "t") this._randomizeAll();
    if(e.key === "c") this._clearAll();
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

  _updateTextData({string, number}) {
    this.pianoTextData[number] = string; 
    console.log(this.pianoTextData)
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
    this._resetPlayedNotes();
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

  // !plural RANDOM 

  _addMidiNoteToPlayedNotes(msg){
    this.playedNotes.add(msg.note.number);
    console.log(this.playedNotes);
  }

  // ? if we change midid channels, played notes will need to change 
  _resetPlayedNotes() {
    this.playedNotes = new Set();
  }

  _randomizeAll() {
    for (let [key, value] of this.playedNotes.entries()) {
      //! WARNING this lasElementChild method shakily depends on the input being the last child so be careful when changing list items for keyboard.slim
      const randTime = randoMize(this._videoLength);
      this.piano[key].lastElementChild.value = randTime;
      this._updateData({time: randTime, number: key});
    }
    M.toast( { html:'Randomized all midi notes played'});
  }

  _clearAll() {
    Object.keys(this.piano).forEach(pianoKeyKey => {
      this.piano[pianoKeyKey].lastElementChild.value = "";
    });
    this.pianoData = {};
    M.toast( { html:'Midi Form Cleared'});
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
  // !Midi Information 
  // ? need this to knwo if a note that is played is in the current visual range 
  get currentMidiPosition() {
    return parseInt(this.noteStampsTarget.getAttribute("data-patterns--keyboard-position"));
  }

  get notesLegend(){
   return JSON.parse(this.noteStampsTarget.getAttribute("data-notes-in-which-octave-identifier"));
  }

  // make button green if the played notes are higher than the current octave
  onOnHighlightingRelevantOctaveButton(msg){
    let noteNumber = msg.note.number
     if(this.notesLegend[noteNumber] < this.currentMidiPosition) {
       //? removing black means default to teal
       this.buttonMinusTarget.classList.remove("black");
      } else if(this.notesLegend[noteNumber] > this.currentMidiPosition) {
        //? removing black means default to teal
      this.buttonPlusTarget.classList.remove("black");
    } else {
      this.buttonPlusTarget.classList.add("black");
    }
  }

  // make button green if the played notes are lower than the current octave
  onOffHighlightingRelevantOctaveButton(msg){
    let noteNumber = msg.note.number
     if(this.notesLegend[noteNumber] < this.currentMidiPosition) {
      this.buttonMinusTarget.classList.add("black");
    } else if(this.notesLegend[noteNumber] > this.currentMidiPosition) {
      this.buttonPlusTarget.classList.add("black");
    } 
  }
  
  // * Midi Information 
  // * Midi Information 


  _play_note(msg) {
    this._get_piano_key(this._get_msg_note_number(msg)).classList.toggle("active", true)
  }

  _unplay_note(msg) {
    this._get_piano_key(this._get_msg_note_number(msg)).classList.toggle("active", false)
  }

  _play_video(msg) {
    if(this.pianoData[msg.note.number]){
      this._video.currentTime(this.pianoData[msg.note.number])
    }
  }

  _activatePianoKey(element) {
    // the button that changes time should light up to indicate activity
    this.saveCurrentTimeTarget.classList.toggle("black", false); // teal by default 
    // add text button 
    this.addTextButtonTarget.classList.toggle("black", false);
    element.parentElement.classList.add("selected")
  }

  _deactivatePianoKey() {
    this.selectedKey.parentElement.classList.remove("selected")
  }

  _deletePianoKey() {
    // the button that changes time should go back to black
    this.saveCurrentTimeTarget.classList.toggle("black", true);
    // add text button 
    this.addTextButtonTarget.classList.toggle("black", true);
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
    alert(error);
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

  // _setPlayAndStopListeners() {
  //   this._midiInput.addListener('stop', 'all', this._setStopping.bind(this))
  //   this._midiInput.addListener('start', 'all', this._setPlaying.bind(this))
  // }

  _on_success(channel) {
    console.log("setting listeners for channel: " + channel)
    // ? just for knowing if midi is being received or not
    // this._setPlayAndStopListeners()
    ///////
    this._midiInput.addListener('noteon', channel, msg => this.onMessageNoteOn(msg))
    this._midiInput.addListener('noteoff', channel, msg => this.onMessageNoteOff(msg))
    this._midiInput.addListener('clock', "all", this.onMessageClock.bind(this))
    this._midiInput.addListener('start', "all", this.onMessageStart.bind(this))
    this._midiInput.addListener('stop', "all", this.onMessageStop.bind(this))
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

  //? set the currently selected input to the current video time 
  //? then unfocus the selcted note to
  saveCurrentTime(){
    console.log("save current time");
    let time = this._video.currentTime();
    this._selectedKey.value = time; 
    this._unselectNote()
  }

  addText() {
    // if we havent selected a note, dont show modal
    if(!this._selectedKey) return 
    const currentKey = this.selectedKey.id;
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems, {title: "whatever"});
    //? if there is presaved data, show it in the input field 
    this.inputValueTarget.value = this.pianoTextData[currentKey] ? this.pianoTextData[currentKey]  : ""
    this.textModalTitleTarget.innerHTML = `Text for midi: ${currentKey}`
    instances[0].open();
  }

  

  onTextType(e){
    let number = this.selectedKey.id;
    let string = e.target.value; 
    this._updateTextData({ number: number, string: string })
  }

  _playText(msg) {
    let num = msg.note.number;
    let textToDisplay = this.pianoTextData[num];
    this.noteTextTarget.innerHTML = textToDisplay
  }

  positionTextForVideo(){
    let textToPosition = this.noteTextTarget;
    let video = document.getElementsByTagName('video')[0]
    var customMessage = textToPosition
    // ! TODO THIS IS STILL NOT WORKED OUT YET
    var customMessageTop = (-1)*(video.offsetHeight / 2 - customMessage.offsetHeight / 4);
    var customMessageLeft = (video.offsetWidth / 2 - customMessage.offsetWidth  / 4);
    customMessage.style.left = customMessageLeft + 'px';
    customMessage.style.top = customMessageTop + 'px';
  }

}


