import { Controller } from "stimulus";

export default class extends Controller {
  // TODO: implement text editing
  static targets = [
    'noteText',
    'boundingBox'
  ];

  connect() {
    this.textPositionX = 0
    this.textPositionY = 0
    // ! Only used for text animation, this is not to be interpreted anywhere else
    this.pos1 = 0;
    this.pos2 = 0; 
    this.pos3 = 0;
    this.pos4 = 0;
    //box boundaries, total width and height in pixels
    this.boxBoundaryX = 0;
    this.boxBoundaryY = 0;
    this.midiDeviceController = this.application.getControllerForElementAndIdentifier(this.element, "patterns--midi-device");
    this.videoWidth = this.noteTextTarget.getAttribute("data-video-width");
    // box width, need it to scale text from 
    this.initialVidContainerWidth = this.boundingBoxTarget.clientWidth;
    this.initialTextPositionX = this.boundingBoxTarget.clientX;
    // TEXT RESIZING 
    // * keep me as member var, i am important and you should be able to change me as a user.
    this.productionFontSize = 12;

    this.scaleFont();
    this.scalePositionText();

    window.addEventListener('resize', this.setPostWindowResize.bind(this));
  }

  setupBoundingBoxForText() {
    // debugger
    this.boxBoundaryX = this.boundingBoxTarget.clientWidth;
    this.boxBoundaryY = this.boundingBoxTarget.clientHeight;
    console.log(`boundary X: ${this.boxBoundaryX},,, boundary Y: ${this.boxBoundaryY}`);
  }

  scalePositionText(ratio) {
    if( ratio === undefined ) {
      ratio = this.calcPositionRatio();
    }

    let left = this.noteTextTarget.offsetLeft; 
    let top = this.noteTextTarget.offsetTop; 
    // debugger
    this.noteTextTarget.style.left = `${(left * ratio).toPrecision()}px`;
    this.noteTextTarget.style.top = `${(top * ratio).toPrecision()}px`;
    // debugger 
    console.log(this.noteTextTarget.style.left, "left position in resize:");
    console.log(this.noteTextTarget.style.top, "top position in resize:");
    // console.log(ratio);
  }

  scaleFont(ratio){
    if( ratio == undefined ) {
      ratio = this.calcFontRatio();
    }
    let newPixelWidth = `${this.productionFontSize * ratio}px`;
    this.noteTextTarget.style.fontSize = newPixelWidth;
  }

  calcFontRatio(){
    return this.boundingBoxTarget.clientWidth / this.videoWidth;
  }

  calcPositionRatio(){
    return this.boundingBoxTarget.clientWidth / this.initialVidContainerWidth;
  }

  // on click text 
  onMouseTextClick(e) {
    // setting up boundaries on each mousedown ()
    // maybe overkill but its nice because we only call it when we need it for 
    // the most part 
    this.setupBoundingBoxForText();
    console.log(`Y: ${e.clientY}`);
    console.log(`X: ${e.clientX}`);
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
     this.pos3 = e.clientX;
     this.pos4 = e.clientY;
     // de alloc on mouseup
     document.onmouseup = this.closeDragElement.bind(this);
     // call a function whenever the cursor moves:
     document.onmousemove = this.elementDrag.bind(this);
  }

  closeDragElement() {
    //get current note to update
    let currentNote = this.midiDeviceController.selectedKey
    if(this.midiDeviceController.selectedKey) {
      currentNote = this.midiDeviceController.selectedKey.id;
    } else {
      currentNote = this.midiDeviceController.lastNote;
    }
    this.updateTextPosition({noteNumber: currentNote, x:this.textPositionX, y:this.textPositionY})
    document.onmouseup = null;
    document.onmousemove = null;
  }

  elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    this.pos1 = this.pos3 - e.clientX;
    this.pos2 = this.pos4 - e.clientY;
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;

    let nextTop = this.noteTextTarget.offsetTop - this.pos2
    let nextLeft = this.noteTextTarget.offsetLeft - this.pos1
    
    // never let text leave bounding box
    if((nextTop + this.noteTextTarget.clientHeight) >= this.boxBoundaryY || nextTop <= 0){
    return;
    }
    if((nextLeft + this.noteTextTarget.clientWidth) >= this.boxBoundaryX || nextLeft <= 0){
    return;
    }

    // set the element's new position:
    this.noteTextTarget.style.top = (nextTop) + "px";
    this.noteTextTarget.style.left = (nextLeft) + "px";
    // continuously update and commit to pianotextdata on mouseup
    this.updateTextPositionLocal(nextLeft,nextTop);
  }

  updateTextPositionLocal(left, top) {
    this.textPositionX = left;
    this.textPositionY = top;
  }

  updateTextPosition({noteNumber,x,y}){
    this.midiDeviceController.pianoTextData.updatePositionFor({noteNumber,x,y})
  }

  // this is custom, on resized dont exist 
  onWindowResized(){
    this.scalePositionText();
    this.scaleFont();
    // save video container width just before resize
    this.initialVidContainerWidth = this.boundingBoxTarget.clientWidth;
    this.initialTextPositionX = this.boundingBoxTarget.clientX;
    this.makeTextVisible();
  }

  // make text disappear until window resized
  setPostWindowResize(){
    // continuously clear the timeout function until window resize ends, clever eh? 
    // i didnt think of it https://www.geeksforgeeks.org/how-to-wait-resize-end-event-and-then-perform-an-action-using-javascript/
    clearTimeout(window.resizedFinished);
    this.makeTextInvisible(); // sadly this gets called over, atm a more efficient solution is not apparent
    window.resizedFinished = setTimeout(this.onWindowResized.bind(this), 500);
  }

  makeTextInvisible(){
    this.noteTextTarget.style.visibility = 'hidden';
  }

  makeTextVisible(){
    this.noteTextTarget.style.visibility = 'visible';
  }


}


