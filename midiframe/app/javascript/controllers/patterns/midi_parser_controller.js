import { Controller } from "stimulus"
import { Midi } from '@tonejs/midi'

export default class extends Controller {

  static targets = ['midiFile']
  // open midi file, 
  // convert each note on event to a midi frame note 
  // { note: event.note.number, timestamp: 234 }
  // send as a POST to patterns/:id 
  async connect() { 
  //   MidiParser.parse( this.midiFileTarget, (obj)=>{
  //     console.log(obj);
  //  });
    this.formatMidiFileData = this.formatMidiFileData.bind(this);
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
    console.log(formattedForBackend);
    // TODO: post to backend and process me!!!! 
    // TODO: maybe do something with overall duration
    // TODO: filter our chords. 

  }
  

  realtTimeEventsArray(events, tickDuration) {
    return events.map((event) => {
      return { noteNumber: event.midi, timestamp: (event.ticks * tickDuration) };
    });
  }

 
  
  async onFilePick(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = this.formatMidiFileData;
    reader.readAsArrayBuffer(file);

  }

}