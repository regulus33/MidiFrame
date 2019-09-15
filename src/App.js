import React from 'react';
import './App.css';
import SingleChannel from './SingleChannel';
import VideoSelector from './VideoSelector'

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
