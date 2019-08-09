import React from 'react';
import './App.css';
import RecordButton from './buttons/RecordButton.js'
import  SingleChannelHelper from './classes/SingleChannelHelper.js'
import StopButton from './buttons/StopButton';
import StartButton from './buttons/StartButton';

const SingleChannel = () => {

  const helper = new SingleChannelHelper(document, window)

  const gridStyles = { 
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  }

  const recordHandler = () => {
    
  }

  return (
    <div id="div" style={{width:'100%',height:'700px',backgroundColor:'cornflowerblue'}} onClick={helper.requestMIDIAccess}>
      <h1 style={{textAlign:"center", letterSpacing: "5px", fontFamily: "Arial, Helvetica, sans-serif", color: "white"}}>CLICK ANYWHERE TO BEGIN... THEN PRESS PLAY ON YOUR OPZ</h1>
      <h1 id="iterableEmoji" style={{textAlign:"center", fontSize: "90px"}}>💀</h1>
      <div styles={gridStyles}>
        <StartButton/>
      </div>
      <div style={gridStyles}> 
        <StopButton/>
        <RecordButton onClick={recordHandler} />
      </div>
    </div>
  );
}

export default SingleChannel