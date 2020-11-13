// TODO: 


export default class PianoTextData {

  constructor() {
    this.scalar = 0.0; 
    // 1:{text:"",size:"",color:"", x:"", y:""},
    this.notes = {};
  }

    // this runs every time we resize the window. 
    // unfortunately, we are mutating data here and it would
    // be better to copy this notes object with translated sizing but 
    // in the interest of simplicity I'm just letting this be 

    // the important thing to remember is that we need to scale the 
    // text on page load, all window resizes 
    // and on http PUT 
    transformNotesTextScaleAndPosition({scalar, fakeWindowWidth}){
      if(fakeWindowWidth == undefined) {
        for(let i = 1;i< 108;i++){
          let currentObj = this.notes[i];
          let x = currentObj.x; 
          let y = currentObj.y;
          currentObj.x = x * scalar;
          currentObj.y = y * scalar;
        }
      } else {

        for(let e = 1;e< 108;e++){
          let o = this.notes[e];
          let left = o.x; 
          let top= o.y;
          let size = o.size;
          o.size = 100*(size/fakeWindowWidth);
          o.x = left * scalar;
          o.y = top * scalar;
        }
      }
    }

    clearTextFor({noteNumber}){
      this.notes[noteNumber].text = "";
    }

    getTextFor({noteNumber}){
     return this.notes[noteNumber].text;
    }

    getColorFor({noteNumber}){
      return this.notes[noteNumber].color;
     }

    getSizeFor({noteNumber}){
      return this.notes[noteNumber].size;
    }

    // TODO: more fields
    initializeFromJson({json}) {
      this.notes = json
    }

    // * PUBLIC MUTATION METHODS
    // update the text
    updateTextFor({noteNumber, text}) {
      this.notes[noteNumber].text = text; 
    }

    updatePositionFor({noteNumber, x, y}) {
      this.notes[noteNumber].x = x;
      this.notes[noteNumber].y = y;
    }

    updateSizeFor({noteNumber, size}) {
      this.notes[noteNumber].size = size;
    }

    updateColorFor({noteNumber, color}) {
      this.notes[noteNumber].color = color; 
    }

    formattedForServer({scalar, fakeWindowWidth, videoWindowRatio}) {
      // multiply everything by the scalar 
      let notesCopy = this.cloneNotes()
      
      for(let i = 1;i< 108;i++){
        let currentObj = notesCopy[i];
        let size = currentObj.size; 
        let x = currentObj.x; 
        let y = currentObj.y;
        currentObj.size = this.calcNonRelativeFontToPixels({size: size, fakeWindowWidth: fakeWindowWidth})
        currentObj.x = x * scalar;
        currentObj.y = y * scalar;

      }
      return notesCopy
    }

    calcNonRelativeFontToPixels({size, fakeWindowWidth}){
       return fakeWindowWidth * (size / 100); 
    }

    // This should/could improve, obviously not very efficient but its an occasional process
    cloneNotes(){
      return JSON.parse(JSON.stringify(this.notes));
    }

  }

  // updateData({string, number}) {
  //   this.textData[number] = string;
  // }
  
  // getString(number) {
  //   if(this.textData[number]) {
  //     return this.textData[number];
  //   } 
  //   return false;
  // }


