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

  const startHandler = (event) => {
    event.target.style["borderTop"] = "100px solid grey"
    helper.startMidi()
    //for offset in video editing later on 
  }

  const recordHandler = (event) => {
    console.log("clicked")
    console.log(event)
    event.target.style.backgroundColor = "#676767"
    helper.setupAndBeginRecording()
    //for offset in video editing later on 
  }

  const stopHandler = (event) => {
    console.log("stop handler called")
    event.target.style.backgroundColor = "#777"
    helper.onStop()
  }

  let textTitle = "1. click the triangle, 2. press play on the op-z, 3. hit record"
  let moreInfo = "While we are still in beta we have to make sure that we hit play on opz AFTER hitting triangle, otherwise we'll get and index out of bounds error when determining start of note(should probably refactor this but I just want to finish the basics first)"


  return (
    <div id="div" style={{width:'100%',height:'700px',backgroundColor:'cornflowerblue'}} onClick={helper.requestMIDIAccess}>
      <h1 style={{textAlign:"center", letterSpacing: "5px", fontFamily: "Arial, Helvetica, sans-serif", color: "white"}}>{textTitle}</h1>
      <p style={{color:"white", textAlign:"center"}}>{moreInfo}</p>
      <h1 id="iterableEmoji" style={{textAlign:"center", fontSize: "90px"}}>💀</h1>
      <div styles={gridStyles}>
        <StartButton onClick={startHandler}/>
      </div>
      <div style={gridStyles}> 
        <StopButton onClick={stopHandler} />
        <RecordButton onClick={recordHandler} />
      </div>
    </div>
  );
}

export default SingleChannel