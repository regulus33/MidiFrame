import { Controller } from "stimulus";
import WebMidi from 'webmidi';
import { toTheNearestThousandth} from '../../helpers/math';

export default class extends Controller {

  static targets = [
    "recordButton",
    "progressBar"
  ];

  connect() {
    this.recording = false; 
    this._enable_midi();
    this.midiEvents = []; 
    this.clockSignalsPassedSinceRecordStart = 0; 
    this.animateProgressBar = this.animateProgressBar.bind(this);
  }

  onMessageClock(message) {
    // ? only count clock signals if recording 
    if (this._recording) {
      console.log(this.clockSignalsPassedSinceRecordStart);
      console.log(message);
      this.clockSignalsPassedSinceRecordStart++
      // console.log(`clock signal passed: ${this.clockSignalsPassedSinceRecordStart} total clock signals: ${this._totaClockSignals}`)
      switch (this.clockSignalsPassedSinceRecordStart) {
        // ! end is reached! exit recording loop
        case this._totaClockSignals:
          this._addStopTime(message.timestamp);
          this._recording = false;
          this._resetClock();
          this.toggleRecordingSession();
          break;
      }
    }
  }

  //? this method adds the starting timestamp (its the most precise way)
  //? and begins adding new midi events to the collection  
  onMessageStart(msg) {
    if (this._recordingSessionOpen) {
      window.requestAnimationFrame(this.animateProgressBar);
      this._addStartEvent(msg.timestamp);
      this._startRecordingMidiNotes();
    }
  }

  getSavedChannel(){
    return Number(this.recordButtonTarget.getAttribute('data-midi-recorder-channel'));
  }

  toggleRecordingSession() {
    this._recordingSessionOpen = !this._recordingSessionOpen;
    M.toast({ html: `recording session ${this._recordingSessionOpen ? 'open' : 'closed'}` });
  }

  _resetClock() {
    this.clockSignalsPassedSinceRecordStart = 0;
  }

  _startRecordingMidiNotes() {
    this._recording = true;
  }

  _numericalValue(str) {
    return toTheNearestThousandth(parseFloat(str));
  }

  // ? RECORDING SESSION 
  get _recordingSessionOpen() {
    return this.recordingSessionOpen;
  }

  set _recordingSessionOpen(isOpen) {
    this.recordingSessionOpen = isOpen;
    this.recordButtonTarget.classList.toggle('open-recording-session');
  }

  //////////////////////////////////////////
  /// WEB MIDI SETUP:                     //
  //////////////////////////////////////////
  // requests access from browser, only runs if access is enabled 
  _enable_midi() {
    WebMidi.enable(error => { error ? this._on_error(error) : this._on_success(this.getSavedChannel()) });
  }

  _on_error(error) {
    alert(error);
  }

  resetMidiListeners(channel) {
    this._wipeListeners();
    this._on_success(channel);
    console.log(`reset all recorder listeners for channel ${channel}`)
  }

  // not necessary to wipe clock and start since they will always remain the same on 'all'
  _wipeListeners() {
    if(this._midiInput){
      this._midiInput.removeListener('noteon');
    }
  }

  _on_success(channel) {
    console.log("setting listeners for channel: " + channel)
    // ? just for knowing if midi is being received or not
    if(this._midiInput){
      this._midiInput.addListener('clock', "all", this.onMessageClock.bind(this));
      this._midiInput.addListener('start', "all", this.onMessageStart.bind(this));
      this._midiInput.addListener('noteon', channel, this.addMidiEvent.bind(this));
    }
  }

  _getPatternId() {
    return this.patternIdTarget.getAttribute("pattern-id");
  }

  _getProjectId() {
    return this.projectIdTarget.getAttribute("project-id");
  }

  _stopMidi() {
    this._midiOutput.sendStop();
  }

  _addStartEvent(timestamp) {
    // ? on first clock signal of recording session we get the received time of the 
    // ? first note 
    let processeableEvent = { note: "start", timestamp: timestamp };
    this.midiEvents.push(processeableEvent);
  }

  _addStopTime(timestamp) {
    let processeableEvent = { note: "stop", timestamp: timestamp };
    this.midiEvents.push(processeableEvent);
  }   

  addMidiEvent(event) {
    let calibratedTimeStamp
    // ? first you need to get the amount of time to subtract from each timestamp so that the first evetn starts at 0:00
    // ? set the timing in the new event  
    if (this._recording) {
      let processeableEvent = { note: event.note.number, timestamp: event.timestamp };
      this.midiEvents.push(processeableEvent);
    }
  }

  // recursively request to execute this dom update before each paint (or frame)
  // 60 fps 
  animateProgressBar(){
    if(this.recording) {
      let percent = `${(this.clockSignalsPassedSinceRecordStart/this._totaClockSignals)*100}%`;
      this.progressBarTarget.style.width=percent;
      console.log(percent);
      console.log(this.clockSignalsPassedSinceRecordStart);
      window.requestAnimationFrame(this.animateProgressBar);
    }
  }

  // **************************************************************
  // ******************* GETTERS AND SETTERS **********************
  // **************************************************************

  // ? CHANNEL
  // ? we get it from the document, it is save in the pattern 
  ///////////////////////////////////////////////////////////////////
  get _channel() {
    return parseInt(this.channelTarget.getAttribute('device-channel'));
  }
/////////////////////////
  get _midiInput() {
    return WebMidi.inputs[0];
  }

  get _midiOutput() {
    return WebMidi.outputs[0];
  }

  get _recording() {
    return this.recording;
  }
  // ? set recording AND also stop or start midi based on value of 'recording'
  set _recording(recording) {
    if (recording) {
      this.recording = true;
    } else {
      this.recording = false;
      this._stopMidi();
    }
  }

  get _totaClockSignals() {
    return parseInt(this.recordButtonTarget.getAttribute("data-midi-recorder-total-clock-signals"));
  }

}


