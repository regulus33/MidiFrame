import React from 'react';
import './App.css';
import SingleChannel from './SingleChannel.js';
import VideoSelectorContainer from './containers/VideoSelectorContainer.js'
import {
  videoSelectorGet
} from './network.js'

function App() {

  let midiRecorded = true

  if (midiRecorded) {
    return (
      <VideoSelectorContainer videoSelectorGet={videoSelectorGet} />
    )
  } else {
    return (
      <SingleChannel />
    )
  }

}

export default App;
