import { Controller } from "stimulus";
import WebMidi from 'webmidi';
import { toTheNearestThousandth } from '../../helpers/math';

export default class extends Controller {

  static targets = [
    // probably dont need these channel targets 
    'channel',
    'step',
  ];

  connect() {
    this.channel = parseInt(this.element.getAttribute("data-saved-channel")); //get the channel 
    this.lastChannelTargetClicked = this.selectedChannel();
    this.initializeChannelUIState();
    this.hoveredStep; // the int of the currently hovered over step
    this.selectedStep;
  }

  initializeChannelUIState() {

  }

  stepClick(event) {
    debugger
    let step = parseInt(event.target.getAttribute("data-step"));
    if (step) {
      this.selectedStep = step;
    } else {
      debugger 
    }

    for (let i = 0; i < (this.selectedStep); i++) {
      let backGroundColor = "#db7676"
      this.stepTargets[i].style.backgroundColor = backGroundColor;
    }

    for (let i = this.selectedStep; i < 32; i++) {
      this.stepTargets[i].style.backgroundColor = "transparent";
    }
  }

  selectedChannel() {
    return this.channelTargets.find((e) => (parseInt(e.getAttribute("data-channel")) === this.channel))
  }

  channelClick(event) {
    this.channel = parseInt(event.target.getAttribute("data-channel"));
    // set background of last el clicked to null
    this.lastChannelTargetClicked.style.backgroundColor = "";
    // make this channel's clicked state obvious to user
    // select the correct channel color (we color code each channel)
    event.target.style.backgroundColor = "#db7676";
    this.lastChannelTargetClicked = event.target;
  }



}


