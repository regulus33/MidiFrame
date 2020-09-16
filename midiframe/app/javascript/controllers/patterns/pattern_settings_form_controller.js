import { Controller } from "stimulus";
import { savePattern } from "../../helpers/network.js"

export default class extends Controller {

  static targets = [
    'requestData'
  ];

  connect() {
    this.midiRecorderController = this.application.getControllerForElementAndIdentifier(this.element, "patterns--midi-recorder");
    this.stepAndChannelController = this.application.getControllerForElementAndIdentifier(this.element,"patterns--step-and-channel");
    this.patternId = this.requestDataTarget.getAttribute("data-midi-parser-patternId");
    this.projectId = this.requestDataTarget.getAttribute("data-midi-parser-projectId");
  }
  
  save() {
    // this is an events array 
    let midiEvents = this.midiRecorderController.midiEvents;
    let stepLength = this.stepAndChannelController.stepLength;
    let channel = this.stepAndChannelController.channel;
    // the midi parser has already sent the midi data if it was engaged by user 
    savePattern(({ midiEvents: midiEvents, channel: channel, stepLength:stepLength, channel: channel, projectId: this.projectId, patternId: this.patternId}));
  }
}


