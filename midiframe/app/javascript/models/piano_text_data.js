// TODO: save all data from text input form into here. 
// * 2. save x and y movements into this data 
// * 3. save size into this data 
// * 4. save color into this data 
// * 5. save scalar into this data
// * 7. make data format from server, check client window/og-video-width
// * 9. interpolate values in ffmpeg and voila
export default class PianoTextData {

  constructor() {
    this.scalar = 0.0; 
    // an array of note texts
    this.notes = {
        1:{text:"",size:"",color:"", x:"", y:""},
        2:{text:"",size:"",color:"", x:"", y:""},
        3:{text:"",size:"",color:"", x:"", y:""},
        4:{text:"",size:"",color:"", x:"", y:""},
        5:{text:"",size:"",color:"", x:"", y:""},
        6:{text:"",size:"",color:"", x:"", y:""},
        7:{text:"",size:"",color:"", x:"", y:""},
        8:{text:"",size:"",color:"", x:"", y:""},
        9:{text:"",size:"",color:"", x:"", y:""},
        10:{text:"",size:"",color:"", x:"", y:""},
        11:{text:"",size:"",color:"", x:"", y:""},
        12:{text:"",size:"",color:"", x:"", y:""},
        13:{text:"",size:"",color:"", x:"", y:""},
        14:{text:"",size:"",color:"", x:"", y:""},
        15:{text:"",size:"",color:"", x:"", y:""},
        16:{text:"",size:"",color:"", x:"", y:""},
        17:{text:"",size:"",color:"", x:"", y:""},
        18:{text:"",size:"",color:"", x:"", y:""},
        19:{text:"",size:"",color:"", x:"", y:""},
        20:{text:"",size:"",color:"", x:"", y:""},
        21:{text:"",size:"",color:"", x:"", y:""},
        22:{text:"",size:"",color:"", x:"", y:""},
        23:{text:"",size:"",color:"", x:"", y:""},
        24:{text:"",size:"",color:"", x:"", y:""},
        25:{text:"",size:"",color:"", x:"", y:""},
        26:{text:"",size:"",color:"", x:"", y:""},
        27:{text:"",size:"",color:"", x:"", y:""},
        28:{text:"",size:"",color:"", x:"", y:""},
        29:{text:"",size:"",color:"", x:"", y:""},
        30:{text:"",size:"",color:"", x:"", y:""},
        31:{text:"",size:"",color:"", x:"", y:""},
        32:{text:"",size:"",color:"", x:"", y:""},
        33:{text:"",size:"",color:"", x:"", y:""},
        34:{text:"",size:"",color:"", x:"", y:""},
        35:{text:"",size:"",color:"", x:"", y:""},
        36:{text:"",size:"",color:"", x:"", y:""},
        37:{text:"",size:"",color:"", x:"", y:""},
        38:{text:"",size:"",color:"", x:"", y:""},
        39:{text:"",size:"",color:"", x:"", y:""},
        40:{text:"",size:"",color:"", x:"", y:""},
        41:{text:"",size:"",color:"", x:"", y:""},
        42:{text:"",size:"",color:"", x:"", y:""},
        43:{text:"",size:"",color:"", x:"", y:""},
        44:{text:"",size:"",color:"", x:"", y:""},
        45:{text:"",size:"",color:"", x:"", y:""},
        46:{text:"",size:"",color:"", x:"", y:""},
        47:{text:"",size:"",color:"", x:"", y:""},
        48:{text:"",size:"",color:"", x:"", y:""},
        49:{text:"",size:"",color:"", x:"", y:""},
        50:{text:"",size:"",color:"", x:"", y:""},
        51:{text:"",size:"",color:"", x:"", y:""},
        52:{text:"",size:"",color:"", x:"", y:""},
        53:{text:"",size:"",color:"", x:"", y:""},
        54:{text:"",size:"",color:"", x:"", y:""},
        55:{text:"",size:"",color:"", x:"", y:""},
        56:{text:"",size:"",color:"", x:"", y:""},
        57:{text:"",size:"",color:"", x:"", y:""},
        58:{text:"",size:"",color:"", x:"", y:""},
        59:{text:"",size:"",color:"", x:"", y:""},
        60:{text:"",size:"",color:"", x:"", y:""},
        61:{text:"",size:"",color:"", x:"", y:""},
        62:{text:"",size:"",color:"", x:"", y:""},
        63:{text:"",size:"",color:"", x:"", y:""},
        64:{text:"",size:"",color:"", x:"", y:""},
        65:{text:"",size:"",color:"", x:"", y:""},
        66:{text:"",size:"",color:"", x:"", y:""},
        67:{text:"",size:"",color:"", x:"", y:""},
        68:{text:"",size:"",color:"", x:"", y:""},
        69:{text:"",size:"",color:"", x:"", y:""},
        70:{text:"",size:"",color:"", x:"", y:""},
        71:{text:"",size:"",color:"", x:"", y:""},
        72:{text:"",size:"",color:"", x:"", y:""},
        73:{text:"",size:"",color:"", x:"", y:""},
        74:{text:"",size:"",color:"", x:"", y:""},
        75:{text:"",size:"",color:"", x:"", y:""},
        76:{text:"",size:"",color:"", x:"", y:""},
        77:{text:"",size:"",color:"", x:"", y:""},
        78:{text:"",size:"",color:"", x:"", y:""},
        79:{text:"",size:"",color:"", x:"", y:""},
        80:{text:"",size:"",color:"", x:"", y:""},
        81:{text:"",size:"",color:"", x:"", y:""},
        82:{text:"",size:"",color:"", x:"", y:""},
        83:{text:"",size:"",color:"", x:"", y:""},
        84:{text:"",size:"",color:"", x:"", y:""},
        85:{text:"",size:"",color:"", x:"", y:""},
        86:{text:"",size:"",color:"", x:"", y:""},
        87:{text:"",size:"",color:"", x:"", y:""},
        88:{text:"",size:"",color:"", x:"", y:""},
        89:{text:"",size:"",color:"", x:"", y:""},
        90:{text:"",size:"",color:"", x:"", y:""},
        91:{text:"",size:"",color:"", x:"", y:""},
        92:{text:"",size:"",color:"", x:"", y:""},
        93:{text:"",size:"",color:"", x:"", y:""},
        94:{text:"",size:"",color:"", x:"", y:""},
        95:{text:"",size:"",color:"", x:"", y:""},
        96:{text:"",size:"",color:"", x:"", y:""},
        97:{text:"",size:"",color:"", x:"", y:""},
        98:{text:"",size:"",color:"", x:"", y:""},
        99:{text:"",size:"",color:"", x:"", y:""},
        100:{text:"",size:"",color:"", x:"", y:""},
        101:{text:"",size:"",color:"", x:"", y:""},
        102:{text:"",size:"",color:"", x:"", y:""},
        103:{text:"",size:"",color:"", x:"", y:""},
        104:{text:"",size:"",color:"", x:"", y:""},
        105:{text:"",size:"",color:"", x:"", y:""},
        106:{text:"",size:"",color:"", x:"", y:""},
        107:{text:"",size:"",color:"", x:"", y:""},
      }
    }

    clearTextFor({noteNumber}){
      this.notes[noteNumber].text = "";
    }

    getTextFor({noteNumber}){
     return this.notes[noteNumber].text;
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


