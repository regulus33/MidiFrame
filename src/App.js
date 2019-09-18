import React from 'react';
import './App.css';
import SingleChannel from './SingleChannel.js';
import VideoSelectorContainer from './containers/VideoSelectorContainer.js'

function App() {

  let midiRecorded = true

  if (midiRecorded) {
    return (
      <VideoSelectorContainer />
    )
  } else {
    return (
      <SingleChannel />
    )
  }

}

export default App;
