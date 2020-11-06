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
    transformNotesTextScaleAndPosition({scalar}){
      for(let i = 1;i< 108;i++){
        
        let currentObj = this.notes[i];
     
        let size = currentObj.size; 
        let x = currentObj.x; 
        let y = currentObj.y;

        currentObj.size = size * scalar;
        currentObj.x = x * scalar;
        currentObj.y = y * scalar;

      }
    }

    clearTextFor({noteNumber}){
      this.notes[noteNumber].text = "";
    }

    getTextFor({noteNumber}){
     return this.notes[noteNumber].text;
    }

    getSizeFor({noteNumber}){
      return this.notes[noteNumber].size;
    }

    // TODO: more fields
    initializeFromJson({json}){
      this.notes = json
    }

    //snapshots the current state to a JSON 
    resolveToJson(){
      return this.notes;
    }

    // * PUBLIC MUTATION METHODS
    // update the text
    updateTextFor({noteNumber, text}){
      this.notes[noteNumber].text = text; 
    }

    updatePositionFor({noteNumber, x, y}){
      this.notes[noteNumber].x = x;
      this.notes[noteNumber].y = y;
    }

    updateSizeFor({noteNumber, size}){
      debugger 
      this.notes[noteNumber].size = size;
    }

    formatDataForServer(){
      // multiply everything by the scalar
    }

    formatDataForClient(){
      // multiply everything by the scalar
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


