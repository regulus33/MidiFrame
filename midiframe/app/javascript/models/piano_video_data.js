import NoteStamp from './note_stamp.js';

export default class PianoVideoData {
  // if mididevice controller finds it in the document, (if user saved note stamps)
  // it will be added to this constructor, but if its false, it means this 
  // PianoVideoData is new. 
  constructor(jsonNoteStamps) {
    this.noteStamps = [];
    if(noteStamps) {
      this.fromJson(jsonNoteStamps);
    }
    // * ELSE this.noteStamps remains as []
  }

  //* the controller for the keyboard view will have {56: 3456} note stamp data
  // if the user has already saved it 
  fromJson(jsonNoteStamps) {
    const noteStampsJson = JSON.parse(jsonNoteStamps);
    noteStampsJson.forEach(notestamp => { 
      this.noteStamps.push(new NoteStamp(notestamp));
    });
  }

  updateData({string, number}) {
    this.textData[number] = string;
  }
  
  getString(number) {
    if(this.textData[number]) {
      return this.textData[number];
    } 
    return false;
  }



}