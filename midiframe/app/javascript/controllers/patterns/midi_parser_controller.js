import { Controller } from "stimulus";
import { Midi } from '@tonejs/midi';
import { savePattern } from '../../helpers/network';

export default class extends Controller {

  static targets = ['midiFile', 'fileName'];
  // open midi file, 
  // convert each note on event to a midi frame note 
  // { note: event.note.number, timestamp: 234 }
  // send as a POST to patterns/:id 
  async connect() { 
  //   MidiParser.parse( this.midiFileTarget, (obj)=>{
  //     console.log(obj);
  //  });
    // console.log();  
    this.formatMidiFileData = this.formatMidiFileData.bind(this);
    this.onFilePick = this.onFilePick.bind(this);
  }

  formatMidiFileData(event) {
    // determine actual duration of ticks in milliseconds based on bpm and ppqn 
    // FORMULA: 60000 / (BPM * PPQ)
    const arrayBuffer = event.target.result;
    const midi = new Midi(arrayBuffer);
    const tempos = midi.header.tempos;
    if (tempos.length > 1) {
      alert('Sorry, we dont support tempo changes yet :(');
      return;
    } 
    const bpm = tempos[0].bpm;
    const ppqn = midi.header.ppq; 
    const tickDurationInMilliseconds = 60000 / (bpm * ppqn);
    const formattedForBackend = this.realtTimeEventsArray(midi.tracks[0].notes, tickDurationInMilliseconds);
    const projectId = this.element.getAttribute("data-midi-parser-projectId");
    const patternId = this.element.getAttribute("data-midi-parser-patternId");
    const channel = this.element.getAttribute("data-midi-parser-channel");
    return savePattern({
      midiEvents: formattedForBackend,
      patternId: patternId,
      projectId: projectId,
      channel: channel,
      pianoTextData: {},
      pianoData: {},
      midiType: "FILE",
    });
    // TODO: post to backend and process me!!!! 
    // insert a start time.. 
  }

  realtTimeEventsArray(events, tickDuration) {
    return events.map((event) => {
      return { note: event.midi, timestamp: (event.ticks * tickDuration) };
    }); 
  }
  
  async onFilePick(event) {
    const file = event.target.files[0];
    if (file.type != "audio/midi") {
      alert('Midi files only please');
      return;
    }
    debugger 
    this.fileNameTarget.innerText = file.name 
    const reader = new FileReader();
    reader.onloadend = this.formatMidiFileData;
    reader.readAsArrayBuffer(file);
  }

} 