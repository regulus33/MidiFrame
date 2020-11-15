import { Controller } from "stimulus";

export default class extends Controller {

  static targets = [
    // probably dont need these channel targets 
    'channel',
    'step',
    'recordButton'
  ];

  connect() {
    this.channel = parseInt(this.element.getAttribute("data-saved-channel")); //get the channel 
    this.lastChannelTargetClicked = this.selectedChannel();
    this.stepLength = parseInt(this.element.getAttribute("data-saved-step")); //get the channel 
    // TODO: how do we de alloc this? 
    this.midiRecorderController = this.application.getControllerForElementAndIdentifier(this.element, "patterns--midi-recorder");
  }

  stepClick(event) {
    let step = parseInt(event.target.getAttribute("data-step"));
    this.stepLength = step
    for (let i = 0; i < (this.stepLength); i++) {
      let backGroundColor = "#db7676"
      this.stepTargets[i].style.backgroundColor = backGroundColor;
    }

    for (let i = this.stepLength; i < 32; i++) {
      this.stepTargets[i].style.backgroundColor = "transparent";
    }
    this.recordButtonTarget.setAttribute("data-midi-recorder-total-clock-signals", this.totalClocksFromBars({bars: this.stepLength}))
  }

  totalClocksFromBars({bars}){
    96 * bars
  }

  selectedChannel() {
    return this.channelTargets.find((e) => (parseInt(e.getAttribute("data-channel")) === this.channel));
  }

  channelClick(event) {
    this.channel = parseInt(event.target.getAttribute("data-channel"));
    this.midiRecorderController.resetMidiListeners(this.channel);
    // set background of last el clicked to null
    this.lastChannelTargetClicked.style.backgroundColor = "";
    // make this channel's clicked state obvious to user
    // select the correct channel color (we color code each channel)
    event.target.style.backgroundColor = "#db7676";
    this.lastChannelTargetClicked = event.target;
  }

}


