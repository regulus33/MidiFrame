import { Controller } from "stimulus";
import WebMidi from 'webmidi';
import videojs from '../../helpers/video.js';
import { toTheNearestThousandth, randoMize } from '../../helpers/math'
import { NUDGE_AMOUNT, baseUrl } from '../../helpers/constants'
import { savePattern, generatePatternClip } from '../../helpers/network'
import PianoTextData from '../../models/piano_text_data'

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
    "textSizeRangeInput",
    "textColorInput"
  ];

  connect() {
    this.piano = {};
    this.pianoData = {};
    this.pianoTextData = new PianoTextData();;
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
    // the current 'mode' either, selecting or demoing midi 
    this.selecting = true;
    this.videoPlaying = false;
    this.lastNote = null;
    //TODO FIX ME 
    window.setTimeout(this.initializeTextData.bind(this), 500);

    // ! debug and test, global access !
    if(window.location.origin != "https://midiframe.com"){
      window.midiDeviceController = this;
    }
  }

  // return 48 if none selected yet
  currentNote(){
    if(this.selectedKey){
      return this.selectedKey.id;
    } else if(this.lastNote){
      return this.lastNote;
    } else {
      return 48
    }
  }

  updateTextPosition({noteNumber, text}){
    this.pianoTextData.updateTextFor({noteNumber:noteNumber,text:text})
  }

  updateCurrentNoteTextPosition() {
    this.pianoTextData.bot
  }
  // onNote

  toggleSelectMode() {
    this.selecting = !this.selecting;
    this.updateUIFromModeChange();
    this._resetMidiListeners();
    // reset midi play listener
  }

  updateUIFromModeChange() {
    // if we are DEMOING
    // remove piano role from dom, hide or disable all buttons EXCEPT
    // toggleOnNotePlay
    if (!this.selecting) {
      this.noteStampsTarget.style.visibility = 'hidden';
      this.toggleSelectModeTarget.innerHTML = "Select";
    } else {
      this.noteStampsTarget.style.visibility = 'visible';
      this.toggleSelectModeTarget.innerHTML = "Play"
    }
  }

  // used for scaling text to original video width
  fakeWindowWidth(){
    let textController = this.application.getControllerForElementAndIdentifier(this.element, "patterns--video-text");
    let ogWidth = textController.videoWidth;
    let currentVideoWidth = textController.boundingBoxTarget.clientWidth;
    let viewportWidth = window.innerWidth;
    let videoWindowRatio =  currentVideoWidth / viewportWidth;
    // * create the fake video window
    let fakeWindowWidth = ogWidth / videoWindowRatio;
    return fakeWindowWidth
  }

  //SAVE BUTTON 
  save() {
    console.log(`[MIDI_DEVICE_CONTROLLER] save(), about to save the project`);

    let textController = this.application.getControllerForElementAndIdentifier(this.element, "patterns--video-text");
    
    let width = textController.lastVideoContainerWidth;
    
    let ogWidth = textController.videoWidth;
    
    let scalar =  ogWidth / width;

    let data = this.pianoTextData.formattedForServer({
      scalar: scalar, 
      fakeWindowWidth: this.fakeWindowWidth()
    });

    return savePattern({ channel: this._channel, pianoData: this.pianoData, pianoTextData: data, midiEvents: this.midiEvents, patternId: this._getPatternId(), projectId: this._getProjectId() })
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
    this.lastNote = number;
  }

  onMessageNoteOnAudition(msg) {
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
    let target = event.target;
    let num = parseInt(target.id);
    if (this._shouldSelectNote(target)) {
      this._selectNote(event);
      // notoff last key before lighting up next 
      if (this.lastNote) {
        this.onMessageNoteOff({ note: { number: this.lastNote } });
      }
      this.onMessageNoteOn({ note: { number: num } });
      this.lastNote = num;
    } else {
      this._unselectNote(target);
    }

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

  // returns the note number of piano key to push when user presses letter. 
  getVisibleNoteIndexFromKey(letter) {
    return {
      a: 0,
      w: 1,
      s: 2,
      e: 3,
      d: 4,
      f: 5,
      t: 6,
      g: 7,
      y: 8,
      h: 9,
      u: 10,
      j: 11,
    }[letter]
  }

  onDocumentKeyDown(e) {
    if (e.code === "Space") {
      if (this.videoPlaying) {
        this.pauseVideo();
      } else {
        this.playVideo()
      }
      return;
    }
    if (this._keyCodeIsNumber(e.key)) {
      this._changeChannel(e.key);
      return
    }
    if (e.metaKey && e.key === "s") {
      e.preventDefault();
      this.save();
      return;
    }
    let index = this.getVisibleNoteIndexFromKey(e.key);
    if (index != undefined) {
      let noteNumber = this.visiblesNoteNumbersArray[index]
      // TODO this is gross:
      this.onMessageNoteOn({ note: { number: noteNumber } });
    }
  }

  onDocumentKeyUp(e) {
    let index = this.getVisibleNoteIndexFromKey(e.key);
    if (index != undefined) {
      let noteNumber = this.visiblesNoteNumbersArray[index]
      // TODO this is gross:
      this.onMessageNoteOff({ note: { number: noteNumber } });
    }
  }

  get visiblesNoteNumbersArray() {
    return JSON.parse(this.noteStampsTarget.getAttribute("data-visible-note-numbers-array"));
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
    // ! done
    this.pianoTextData.updateTextFor({noteNumber: number, text: string})
    console.log(this.pianoTextData)
  }

  // TODO: i think the object may need data to be converted i.e. integers 
  _initializePianoData() {
    let noteStamps = JSON.parse(this.noteStampsTarget.getAttribute("note-stamps"))
    if (noteStamps) {
      this.pianoData = noteStamps
    }
  }
  // take the html strings from db and save into pianoTextData
  initializeTextData() {
    let textStamps = JSON.parse(this.noteStampsTarget.getAttribute("text-stamps"))

    if (textStamps) {
      this.pianoTextData.initializeFromJson({json:textStamps});
      // as soon as data is in memory we need to scale the font-size and x-y position
      this.application.getControllerForElementAndIdentifier(this.element, "patterns--video-text").scaleScaleables(this.fakeWindowWidth());
    }
  }

  _addKeyDownChannelListener() {
    window.addEventListener('keydown', this.onDocumentKeyDown.bind(this));
    window.addEventListener('keyup', this.onDocumentKeyUp.bind(this));
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

  _unselectNote(element) {
    this._deactivatePianoKey(element)
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
    this.saveCurrentTimeTarget.classList.toggle("teal", true) // teal by default 
    // add text button 
    this.addTextButtonTarget.classList.toggle("grey", false);
    this.addTextButtonTarget.classList.toggle("teal", true)

    this.randomizeOneTarget.classList.toggle("grey", false);
    this.randomizeOneTarget.classList.toggle("teal", true)

    element.parentElement.classList.add("selected");
  }

  _deactivatePianoKey(element) {
    this.randomizeOneTarget.classList.toggle("grey", true);
    element.parentElement.classList.remove("selected");
    element.parentElement.classList.remove("active");
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
    if (this.selecting) {
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

  playVideo() {
    this._video.play();
    this.videoPlaying = true;
  }

  pauseVideo() {
    this._video.pause();
    this.videoPlaying = false;
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
    // get current data key
    const currentKey = this.selectedKey.id;
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems, { title: "whatever" });
    // this.textSizeRangeInput.
    // SET UI TO CURRENT VALLL
    this.textSizeRangeInputTarget.value = this.pianoTextData.getSizeFor({noteNumber:this.currentNote()});
    //? if there is presaved data, show it in the input field 
    // * put the data from the pianotextdata into the form so user knows
    // ! done
    this.inputValueTarget.value = this.pianoTextData.getTextFor({noteNumber: currentKey})
    this.textColorInputTarget.value = this.pianoTextData.getColorFor({noteNumber: currentKey})
    this.textModalTitleTarget.innerHTML = `Text for midi: ${currentKey}`

    instances[0].open();
  }

  onTextType(e) {
    let number = this.selectedKey.id;
    let string = e.target.value;
    this._updateTextData({ number: number, string: string });
  }

  // !DONE
  _playText(num) {
    let data = this.pianoTextData.notes[num];
    this.noteTextTarget.innerHTML = data["text"];
    //position text
    this.noteTextTarget.style.left = `${data["x"]}px`;
    this.noteTextTarget.style.top = `${data["y"]}px`;
    //size text 
    this.noteTextTarget.style.fontSize = `${data.size}vmax`

    this.noteTextTarget.style.color = data["color"];
  }
  // data action 
  // !DONE
  clearText() {
    this.pianoTextData.clearTextFor({noteNumber:this.selectedKey.id})
  }

}


