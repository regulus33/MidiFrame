import { Controller } from "stimulus";

export default class extends Controller {

  static targets = [
    'noteText'
  ];

  connect() {
    this.pos1 = 0;
    this.pos2 = 0; 
    this.pos3 = 0;
    this.pos4 = 0;
    this.midiDeviceController = this.application.getControllerForElementAndIdentifier(this.element, "patterns--midi-device");
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


