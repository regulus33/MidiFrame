import { Controller } from "stimulus";
import WebMidi from 'webmidi';
import videojs from '../../helpers/video.js';
import { toTheNearestThousandth, randoMize } from '../../helpers/math'
import { NUDGE_AMOUNT, baseUrl } from '../../helpers/constants'
import { savePattern, generatePatternClip } from '../../helpers/network'

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
    "inputValue",
    "randomizeOne",
    "toggleSelectMode",
    "randomizeAll",
    "saveButton",
    "clearAll",
  ];

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
    this.isSeeking = false;
    //? text styling
    this.positionTextForVideo();
    this.positionTextOnWindowResize();
    this._initializeTextData();
    // the current 'mode' either, selecting or demoing midi 
    this.selecting = true;
  }

  toggleSelectMode(){
    this.selecting = !this.selecting;
    this.updateUIFromModeChange(); 
    this._resetMidiListeners();
    // reset midi play listener
  }

  updateUIFromModeChange(){
    // if we are DEMOING
    // remove piano role from dom, hide or disable all buttons EXCEPT
    // toggleOnNotePlay
    if(!this.selecting){
      this.noteStampsTarget.style.visibility = 'hidden';
      this.toggleSelectModeTarget.innerHTML = "Select";
    } else {
      this.noteStampsTarget.style.visibility = 'visible';
      this.toggleSelectModeTarget.innerHTML = "Play"
    }
  }

  // when 

  //SAVE BUTTON 
  save() {
    console.log(`[MIDI_DEVICE_CONTROLLER] save(), about to save the project`);
    return savePattern({ channel: this._channel, pianoData: this.pianoData, pianoTextData: this.pianoTextData, midiEvents: this.midiEvents, patternId: this._getPatternId(), projectId: this._getProjectId() })
      .then(() => {
        console.log(`[MIDI_DEVICE_CONTROLLER] save(), returning from network response`)
        M.toast({ html: 'Pattern Saved' })
        // ? if the midi events are at the server, there is no reason for them to 
        // ? hang around in memory, clear the array in preparation for new recordings 
        this._clearMidiEvents()
      });
  }

  saveAndNavigate() {
    // console.log(this._settingsUrl)
    this.save().then(() => {
      // console.log(this._settingsUrl)
      window.location.href = baseUrl + this._settingsUrl
    });
  }

  //? submitting data to be converted into a video 
  generatePatternClip() {
    // ! save before we tell controller to generate 
    this.save().then((e) => {
      generatePatternClip({ patternId: this._getPatternId(), projectId: this._getProjectId() }).then(() => {
      })
    })
  }
  // there should be rwo messagenoteons? 
  onMessageNoteOn(msg) {
    console.log("onMessageNoteOn: " + msg);
    const number = msg.note.number;
    this._play_note(number);
    this._play_video(number);
    this.onOnHighlightingRelevantOctaveButton(number);
    this._playText(number);
  }

  onMessageNoteOnAudition(msg){
    this._play_video(msg.note.number);
  }

  onMessageNoteOff(msg) {
    let note = msg.note.number;
    this._unplay_note(note);
    this.onOffHighlightingRelevantOctaveButton(note);
  }

  //? this method adds the starting timestamp (its the most precise way)
  //? and begins adding new midi events to the collection  
  onMessageStart(msg) {
    this.playVideo();
  }

  onMessageStop() {
    this.stopVideo();
  }

  playVideo() {
    this._video.play();
  }

  stopVideo() {
    this._video.pause();
  }

  onPianoKeyClick(event) {
    this._shouldSelectNote(event.target) ? this._selectNote(event) : this._unselectNote();
  }

  updateSelectedNoteTime(event) {
    // ?exit immediately if we are playing midi, user is not allowed to timestamp drag in that state. 
    // if(this._playing) return 
    // if user is not actively seeking return, we are just playing midi notes and calling this because seeking is 
    // triggered when currentTime = is used 
    if (!this._isSeeking) return
    let filteredTime = toTheNearestThousandth(event.target.player.currentTime())
    if (this._selectedKey) {

      this._updateData({ time: filteredTime, number: this._selectedKey.id })
      this._selectedKey.value = filteredTime
    }
  }

  onDocumentKeyDown(e) {
    if (this._keyCodeIsNumber(e.key)) this._changeChannel(e.key);
    if (e.metaKey && e.key === "s") {
      e.preventDefault();
      this.save();
    }
    if (e.ctrlKey) {
      if (e.key === "t") this.randomizeAll();
      if (e.key === "c") this.clearAll();
    }
  }

  randomizeOneNote() {
    let selectedElement = document.getElementsByClassName("selected")
    if (selectedElement.length > 0) {
      this._randomize(selectedElement[0].children[3]);
    }
  }

  onFormKeyDown(e) {
    e.preventDefault()
    if (e.ctrlKey) {
      switch (e.key) {
        case "]":
          this._nudgeTimeRight(e.target)
          break
        case "[":
          this._nudgeTimeLeft(e.target)
          break
        case "r":
          // hot key combo so we dont randomize input while typing form input 
          this._randomize(e.target)
      }
    }
  }


  // **************************************************
  // ! PRIVATE METHODS PRIVATE METHODS PRIVATE METHODS
  // *************************************************

  _clearMidiEvents() {
    this._midiEvents = []
  }

  _updateData({ time, number }) {
    this.pianoData[number] = time
  }

  _updateTextData({ string, number }) {
    this.pianoTextData[number] = string;
    console.log(this.pianoTextData)
  }

  // TODO: i think the object may need data to be converted i.e. integers 
  _initializePianoData() {
    let noteStamps = JSON.parse(this.noteStampsTarget.getAttribute("note-stamps"))
    if (noteStamps) {
      this.pianoData = noteStamps
    }
  }

  _initializeTextData() {
    let textStamps = JSON.parse(this.noteStampsTarget.getAttribute("text-stamps"))
    if (textStamps) {
      this.pianoTextData = textStamps
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
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(parseInt(code))
  }

  _numericalValue(str) {
    return toTheNearestThousandth(parseFloat(str))
  }

  _nudgeTimeRight(element) {
    let time = this._numericalValue(element.value)
    time += NUDGE_AMOUNT
    time = toTheNearestThousandth(time)
    this._updateData({ time: time, number: element.id })
    element.value = time
  }

  _nudgeTimeLeft(element) {
    let time = this._numericalValue(element.value)
    let nextTime = toTheNearestThousandth(time - NUDGE_AMOUNT)
    time = nextTime < 0 ? 0 : nextTime
    this._updateData({ time: time, number: element.id })
    element.value = time
  }

  _randomize(element) {
    console.log("randomizing video, video length: " + this._videoLength);
    let randomValue = randoMize(this._videoLength)
    this._updateData({ time: randomValue, number: element.id })
    element.value = randomValue
  }

  randomizeAll() {
    for (let key = 0; key < 108; key++) {
      //! WARNING this lasElementChild method shakily depends on the input being the last child so be careful when changing list items for keyboard.slim
      const randTime = randoMize(this._videoLength);
      this.piano[key].lastElementChild.value = randTime;
      this._updateData({ time: randTime, number: key });
    }
    // M.toast({ html: 'Randomized!' });
  }

  clearAll() {
    Object.keys(this.piano).forEach(pianoKeyKey => {
      this.piano[pianoKeyKey].lastElementChild.value = "";
    });
    this.pianoData = {};
    M.toast({ html: 'Midi Form Cleared' });
  }

  _shouldSelectNote(element) {
    return this._selectedKey && this._selectedKey.id == element.id ? false : true
  }

  _selectNote(event) {
    this._selectedKey = event.target
    this._selectedKey.addEventListener('keydown', (e) => { this.onFormKeyDown(e) })
  }

  _unselectNote() {
    this._deactivatePianoKey(this._selectedKey)
    this._deletePianoKey()
  }
  // !Midi Information 
  // ? need this to knwo if a note that is played is in the current visual range 
  get currentMidiPosition() {
    return parseInt(this.noteStampsTarget.getAttribute("data-patterns--keyboard-position"));
  }

  get notesLegend() {
    return JSON.parse(this.noteStampsTarget.getAttribute("data-notes-in-which-octave-identifier"));
  }

  // make button green if the played notes are higher than the current octave
  onOnHighlightingRelevantOctaveButton(noteNumber) {
    console.log(`played note ${this.notesLegend[noteNumber]} current note: ${this.currentMidiPosition}`)
    if (this.notesLegend[noteNumber] < this.currentMidiPosition) {
      //? removing black means default to teal
      this.buttonMinusTarget.classList.remove("grey");
    } else if (this.notesLegend[noteNumber] > this.currentMidiPosition) {
      //? removing grey means default to teal
      this.buttonPlusTarget.classList.remove("grey");
    } else {
      this.buttonPlusTarget.classList.add("grey");
    }
  }

  // make button green if the played notes are lower than the current octave
  onOffHighlightingRelevantOctaveButton(noteNumber) {
    if (this.notesLegend[noteNumber] < this.currentMidiPosition) {
      this.buttonMinusTarget.classList.add("grey");
    } else if (this.notesLegend[noteNumber] > this.currentMidiPosition) {
      this.buttonPlusTarget.classList.add("grey");
    }
  }

  // * Midi Information 

  _play_note(number) {
    this._getPianoKey(number).classList.toggle("active", true)
  }

  _unplay_note(number) {
    this._getPianoKey(number).classList.toggle("active", false)
  }

  _play_video(number) {
    if (this.pianoData[number]) {
      this._video.currentTime(this.pianoData[number])
    }
  }

  _activatePianoKey(element) {
    // the button that changes time should light up to indicate activity
    this.saveCurrentTimeTarget.classList.toggle("grey", false); // teal by default 
    // add text button 
    this.addTextButtonTarget.classList.toggle("grey", false);

    this.randomizeOneTarget.classList.toggle("grey", false);

    element.parentElement.classList.add("selected");
  }

  _deactivatePianoKey() {
    this.selectedKey.parentElement.classList.remove("selected")
    this.randomizeOneTarget.classList.toggle("grey", true);
  }

  _deletePianoKey() {
    // the button that changes time should go back to black
    this.saveCurrentTimeTarget.classList.toggle("grey", true);
    // add text button 
    this.addTextButtonTarget.classList.toggle("grey", true);
    this.selectedKey = null
  }

  _getPianoKey(number) {
    return this._piano[number]
  }

  _add_key_to_piano({ noteNumber, pianoKey }) {
    this._piano[noteNumber] = pianoKey
  }

  _get_note_number(keyElement) {
    return parseInt(keyElement.getAttribute('midi-note-number'))
  }

  _observe_all_keys() {
    this.keyBoardKeyTargets.forEach(keyElement => {
      this._add_key_to_piano({ pianoKey: keyElement, noteNumber: this._get_note_number(keyElement) })
    })
  }

  //////////////////////////////////////////
  /// WEB MIDI SETUP:                     //
  //////////////////////////////////////////
  // basically requests access from browser, only runs if access is enabled 
  _enable_midi() {
    WebMidi.enable(error => { error ? this._on_error(error) : this._onSuccess(this.getSavedChannel()) })
  }

  getSavedChannel() {
    return Number(this.channelTarget.getAttribute('device-channel'));
  }

  _on_error(error) {
    alert(error);
  }

  _wipeListeners() {
    this._midiInput.removeListener('noteon')
    this._midiInput.removeListener('noteoff')
  }

  _resetMidiListeners(channel) {
    this._wipeListeners()
    this._onSuccess(channel)
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

  _onSuccess(channel) {
    console.log("setting listeners for channel: " + channel);
    // if we are in time stamp select mode, set the appropriate handler, else, use the slimmed down video player
    if(this.selecting){
      this._midiInput.addListener('noteon', channel, msg => this.onMessageNoteOn(msg));
      this._midiInput.addListener('noteoff', channel, msg => this.onMessageNoteOff(msg));
    } else {
      this._midiInput.addListener('noteon', channel, msg => this.onMessageNoteOnAudition(msg));
      
    }
    this._midiInput.addListener('start', "all", this.onMessageStart.bind(this))
    this._midiInput.addListener('stop', "all", this.onMessageStop.bind(this))
  }

  _getPatternId() {
    return this.patternIdTarget.getAttribute("pattern-id")
  }

  _getProjectId() {
    return this.projectIdTarget.getAttribute("project-id")
  }


  // **************************************************************
  // ******************* GETTERS AND SETTERS **********************
  // **************************************************************

  // ? CHANNEL
  // ? we get it from the document, it is save in the pattern 
  ///////////////////////////////////////////////////////////////////
  get _channel() {
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
  get _midiInput() {
    return WebMidi.inputs[0]
  }

  get _midiOutput() {
    return WebMidi.outputs[0]
  }

  get _piano() {
    return this.piano
  }

  // ? PLAYING we use this to light up channel, to notify forms to ignore playhead's value 
  // ? and probably a multitude of other things as new requirements emerge. 
  /////////////////////////
  get _playing() {
    return this.playing
  }

  set _playing(playing) {
    this.playing = playing
  }

  ////////////////////////////////////////////////////////////////////////
  // ? SELECTED KEY 
  // ? get the key (form input) that we need to change the time on 
  get _selectedKey() {
    return this.selectedKey
  }
  // ? set the key we will be performing for input changes on 
  set _selectedKey(element) {
    if (this.selectedKey) {
      this._deactivatePianoKey(this.selectedKey)
    }
    this._activatePianoKey(element)
    this.selectedKey = element
  }
  //////////////////////////////////////////////////////
  // ? which url to navigate to update pattern 
  get _settingsUrl() {
    return this.settingsTarget.getAttribute("nav-url")
  }

  // ? pre-calculated (on server side) total clock signals before a record session ends 
  get _totaClockSignals() {
    return parseInt(this.recordButtonTarget.getAttribute("total-clock-signals"))
  }

  // ? return the video element 
  get _video() {
    return this.video
  }

  // ? used to calculate a random timestamp within video length range 
  get _videoLength() {
    return this._video.duration();
  }

  //? set the currently selected input to the current video time 
  //? then unfocus the selcted note to
  // !broken
  saveCurrentTime() {
    console.log("save current time");
    let time = this._video.currentTime();
    this._selectedKey.value = time;
    this._updateData({ time: time, number: this._selectedKey.id });
    console.log(this.pianoData);
    console.log(this.piano);
    console.log("video video current time = " + this._video.currentTime())
    this._unselectNote();
  }

  addText() {
    // if we havent selected a note, dont show modal
    if (!this._selectedKey) return
    const currentKey = this.selectedKey.id;
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems, { title: "whatever" });
    //? if there is presaved data, show it in the input field 
    this.inputValueTarget.value = this.pianoTextData[currentKey] ? this.pianoTextData[currentKey] : ""
    this.textModalTitleTarget.innerHTML = `Text for midi: ${currentKey}`
    instances[0].open();
  }

  onTextType(e) {
    let number = this.selectedKey.id;
    let string = e.target.value;
    this._updateTextData({ number: number, string: string })
  }

  _playText(num) {
    if (this.pianoTextData[num]) {
      let textToDisplay = this.pianoTextData[num];
      this.noteTextTarget.innerHTML = textToDisplay;
    }
  }
  // data action 
  clearText() {
    delete this.pianoTextData[this.selectedKey.id]
  }

  // ? js centering of optional video text 
  positionTextForVideo() {
    let textPosition = this.noteTextTarget;
    let video = document.getElementsByTagName('video')[0]
    // ! TODO THIS IS STILL NOT WORKED OUT YET
    var textPositionTop = video.offsetHeight / 2;
    var textPositionLeft = (video.offsetWidth / 2 - textPosition.width);
    textPosition.style.left = textPositionLeft + 'px';
    textPosition.style.top = textPositionTop + 'px';
  }

  positionTextOnWindowResize() {
    window.addEventListener('resize', this.positionTextForVideo.bind(this));
  }

}


