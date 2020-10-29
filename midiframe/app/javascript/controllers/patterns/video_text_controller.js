import { Controller } from "stimulus";

export default class extends Controller {
  // TODO: implement text editing
  static targets = [
    'noteText',
    'boundingBox'
  ];

  connect() {
    // text position
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
    // ******************
    // ******************
    // ******************
    // TEXT RESIZING 
    // * keep me as member var, i am important and you should be able to change me as a user.
    this.productionFontSize = 12;
    // * this happens once no matter what and then after, everytime we resize window 
    // on load and on window resize:
    // * scale font by the ratio of the expanded video width compared to OG width. 
    // let ratio = this.window.width / this.videoWidth
    // this.textNode.fontSize = `${this.productionFontSize * ratio}px`
    this.scaleFont();
    // *****************
    // *****************
    // *****************
    // *****************
    // !POSITION POSITION
  
    // !POSITION POSITION


    window.addEventListener('resize', this.scaleFont.bind(this));
    // also add the on "RESIZED" event listener
    window.addEventListener('resize', this.setPostWindowResize.bind(this));
  }

  setupBoundingBoxForText(){
    // debugger
    this.boxBoundaryX = this.boundingBoxTarget.clientWidth;
    this.boxBoundaryY = this.boundingBoxTarget.clientHeight;
    console.log(`boundary X: ${this.boxBoundaryX},,, boundary Y: ${this.boxBoundaryY}`);
  }

  scalePositionText(){
    let positionRatio = this.boundingBoxTarget.clientWidth / this.initialVidContainerWidth;
    let left = this.noteTextTarget.offsetLeft; 
    let top = this.noteTextTarget.offsetTop; 
    // debugger
    this.noteTextTarget.style.left = `${(left * positionRatio).toPrecision()}px`;
    this.noteTextTarget.style.top = `${(top * positionRatio).toPrecision()}px`;
    // debugger 
    console.log(this.noteTextTarget.style.left, "left position in resize:");
    console.log(this.noteTextTarget.style.top, "top position in resize:");
    // console.log(positionRatio);
  }

  scaleFont(){
    let fontSizeRatio =  this.boundingBoxTarget.clientWidth / this.videoWidth;
    let newPixelWidth = `${this.productionFontSize * fontSizeRatio}px`;
    this.noteTextTarget.style.fontSize = newPixelWidth;
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

  elementDrag(e) {
     e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:

    // offset left is now 0 or last position minus current clientX value
    this.pos1 = this.pos3 - e.clientX;
    // offset top is now 0 or last position minus current clientX value
    // so it is a bit like i-- 
     this.pos2 = this.pos4 - e.clientY;
     this.pos3 = e.clientX;
     this.pos4 = e.clientY;

     let nextTop = this.noteTextTarget.offsetTop - this.pos2
     let nextLeft = this.noteTextTarget.offsetLeft - this.pos1
    // this is kind of Naive as the text is never allowed to be placed at edge
    // mouse reaches boundary before, but its easy to understand
    console.log(this.boxBoundaryY + "boundaryyyyyyyyyyyyyyyyy")
    if((nextTop + this.noteTextTarget.clientHeight) >= this.boxBoundaryY || nextTop <= 0){
      return;
    }
    if((nextLeft + this.noteTextTarget.clientWidth) >= this.boxBoundaryX || nextLeft <= 0){
      return;
    }
    // set the element's new position:
    this.noteTextTarget.style.top = (nextTop) + "px";
    this.noteTextTarget.style.left = (nextLeft) + "px";
    console.log(`left position in drag: ${this.noteTextTarget.style.left}`);
    console.log(`top position in drag: ${this.noteTextTarget.style.top}`);
  }

  closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

  // this is custom, on resized dont exist 
  onWindowResized(){
    alert('done resizing')
    this.scalePositionText();
    this.initialVidContainerWidth = this.boundingBoxTarget.clientWidth;
    this.initialTextPositionX = this.boundingBoxTarget.clientX;
    this.makeTextVisible()
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


