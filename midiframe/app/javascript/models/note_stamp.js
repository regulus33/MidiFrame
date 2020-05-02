// * data class for object like this {56: 345}
// notestamps are just an object where the key is the midi representation of 
// a note on a keyboard and the value is a float that represents the timestamp we 
// want to jerk to in the video (in milliseconds)
// for more information on how midi notes are identified see here: https://djip.co/blog/logic-studio-9-midi-note-numbers
// * its ok to be lost about the above statement, 
// at the end of the day our program does not care what that data means
// it only cares what we need to do with that data. 
export default class NoteStamp {
  constructor({note: note, timestamp: timestamp}){
    this.note = note; 
    this.timestamp = timestamp;
  }

  get note(){
    return this.note;
  }

  get timestamp(){
    return this.timestamp;
  }

  set note(note){
    this.note = note;
  }

  set timestamp(timestamp){
    this.timestamp = timestamp;
  }
}