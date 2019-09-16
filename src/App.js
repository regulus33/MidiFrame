import React from 'react';
import './App.css';
import SingleChannel from './SingleChannel.js';
import VideoSelector from './VideoSelector.js'

function App() {

  let midiRecorded = true

  if (midiRecorded) {
    return (
      <VideoSelector />
    )
  } else {
    return (
      <SingleChannel />
    )
  }

}

export default App;
