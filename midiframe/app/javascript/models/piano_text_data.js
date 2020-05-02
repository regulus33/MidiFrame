class PianoTextData {

  constructor() {
    this.textData = {
      // 23: 'text to display when 23 displays'
    }
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