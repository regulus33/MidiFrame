import { Controller } from "stimulus";

export default class extends Controller {
  // TODO: implement text editing
  static targets = [
    'noteText'
  ];

  connect() {
    this.pos1 = 0;
    this.pos2 = 0; 
    this.pos3 = 0;
    this.pos4 = 0;
    this.midiDeviceController = this.application.getControllerForElementAndIdentifier(this.element, "patterns--midi-device");
    this.videoWidth = this.noteTextTarget.getAttribute("data-video-width");
    
    // TODO: 
    // * keep me as member var, i am important and you should be able to change me as a user.
    this.productionFontSize = 12;
    // * this happens once no matter what and then after, everytime we resize window 
    // on load and on window resize:
    // * scale font by the ratio of the expanded video width compared to OG width. 
    // let ratio = this.window.width / this.videoWidth
    // this.textNode.fontSize = `${this.productionFontSize * ratio}px`
    this.scaleFont()
    window.addEventListener(
      'resize', 
      this.scaleFont.bind(this)
    );
  }

  scaleFont(){
    let ratio = window.innerWidth / this.videoWidth;
    let newPixelWidth = `${this.productionFontSize * ratio}px`;
    this.noteTextTarget.style.fontSize = newPixelWidth;
    debugger 
  }

  onMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
     this.pos3 = e.clientX;
     this.pos4 = e.clientY;
    document.onmouseup = this.closeDragElement.bind(this);
    // call a function whenever the cursor moves:
    document.onmousemove = this.elementDrag.bind(this);
  }

  elementDrag(e) {
     e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
     this.pos1 = this.pos3 - e.clientX;
     this.pos2 = this.pos4 - e.clientY;
     this.pos3 = e.clientX;
     this.pos4 = e.clientY;
    // set the element's new position:
    this.noteTextTarget.style.top = (this.noteTextTarget.offsetTop - this.pos2) + "px";
    this.noteTextTarget.style.left = (this.noteTextTarget.offsetLeft - this.pos1) + "px";
  }

  closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

}


