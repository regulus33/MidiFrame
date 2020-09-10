import { Controller } from "stimulus";
import WebMidi from 'webmidi';
import { toTheNearestThousandth } from '../../helpers/math';

export default class extends Controller {

  static targets = [
    // probably dont need these channel targets 
    'channel',
    'stepone',
    'steptwo',
    'stepthree',
    'stepfour',
    'stepfive',
    'stepsix',
    'stepseven',
    'stepeight',
    'stepnine',
    'stepten',
    'stepeleven',
    'steptwelve',
    'stepthirteen',
    'stepfourteen',
    'stepfifteen',
    'stepsixteen',
    'stepseventeen',
    'stepeighteen',
    'stepnineteen',
    'steptwenty',
    'steptwentyone',
    'steptwentytwo',
    'steptwentythree',
    'steptwentyfour',
    'steptwentyfive',
    'steptwentysix',
    'steptwentyseven',
    'steptwentyeight',
    'steptwentynine',
    'stepthirty',
    'stepthirty one',
    'stepthirty two',
    'stepthirty three',
    'stepthirty four',
    'stepthirty five',
    'stepone',
    'steptwo',
    'stepthree',
    'stepfour',
    'stepfive',
    'stepsix',
    'stepseven',
    'stepeight',
    'stepnine',
    'stepten',
    'stepeleven',
    'steptwelve',
    'stepthirteen',
    'stepfourteen',
    'stepfifteen',
    'stepsixteen',
    'stepseventeen',
    'stepeighteen',
    'stepnineteen',
    'steptwenty',
    'steptwentyone',
    'steptwentytwo',
    'steptwentythree',
    'steptwentyfour',
    'steptwentyfive',
    'steptwentysix',
    'steptwentyseven',
    'steptwentyeight',
    'steptwentynine',
    'stepthirty',
    'stepthirtyone',
    'stepthirtytwo',
    'stepthirtythree',
    'stepthirtyfour',
    'stepthirtyfive',
    'stepone',
    'steptwo',
    'stepthree',
    'stepfour',
    'stepfive',
    'stepsix',
    'stepseven',
    'stepeight',
    'stepnine',
    'stepten',
    'stepeleven',
    'steptwelve',
    'stepthirteen',
    'stepfourteen',
    'stepfifteen',
    'stepsixteen',
    'stepseventeen',
    'stepeighteen',
    'stepnineteen',
    'steptwenty',
    'steptwentyone',
    'steptwentytwo',
    'steptwentythree',
    'steptwentyfour',
    'steptwentyfive',
    'steptwentysix',
    'steptwentyseven',
    'steptwentyeight',
    'steptwentynine',
    'stepthirty',
    'stepthirtyone',
    'stepthirtytwo',
    'stepthirtythree',
    'stepthirtyfour',
    'stepthirtyfive',
    'stepthirtysix',
    'stepthirtyseven',
    'stepthirtyeight',
    'stepthirtynine',
    'stepforty',
    'stepfortyone',
    'stepfortytwo',
    'stepfortythree',
    'stepfortyfour',
    'stepfortyfive',
    'stepfortysix',
    'stepfortyseven',
    'stepfortyeight',
    'stepfortynine',
    'stepfifty',
    'stepfiftyone',
    'stepfiftytwo',
    'stepfiftythree',
    'stepfiftyfour',
    'stepfiftyfive',
    'stepfiftysix',
    'stepfiftyseven',
    'stepfiftyeight',
    'stepfiftynine',
    'stepsixty',
    'stepsixtyone',
    'stepsixtytwo',
    'stepsixtythree',
    'stepsixtyfour',
  ];

  connect() {
    this.channel = parseInt(this.element.getAttribute("data-saved-channel")); //get the channel 
    this.channelColors = [
      "#d88c98",
      "#d2d0a9",
      "#e3c7a7",
      "#99c1b9",
      "#8e7dbe",
      "#b53e54",
      "#e19238",
      "#cf9e66",
      "#5a9287",
      "#5b488f",
      "#d88c98",
      "#d2d0a9",
      "#e3c7a7",
      "#99c1b9",
      "#8e7dbe",
      "#b53e54",
    ];
    this.lastChannelTargetClicked = this.selectedChannel(); 
    this.initializeChannelUIState();
  }

  initializeChannelUIState(){

  }

  stepClick(event) {

  }

  selectedChannel(){
   return this.channelTargets.find((e)=>( parseInt(e.getAttribute("data-channel")) === this.channel))
  }

  channelClick(event) {
    this.channel = parseInt(event.target.getAttribute("data-channel"));
    // set background of last el clicked to null
    this.lastChannelTargetClicked.style.backgroundColor = "";
    // make this channel's clicked state obvious to user
    // select the correct channel color (we color code each channel)
    event.target.style.backgroundColor = this.channelColors[this.channel-1];
    this.lastChannelTargetClicked = event.target;
  }



  


}


