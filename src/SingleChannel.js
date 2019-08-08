import React from 'react';
import logo from './logo.svg';
import './App.css';
import  SingleChannelHelper from './classes/SingleChannelHelper.js'

const SingleChannel = (onClick) => {

const helper = new SingleChannelHelper(document, window)

  return (
    <div id="div" style={{width:'100%',height:'700px',backgroundColor:'cornflowerblue'}} onClick={helper.requestMIDIAccess}>
      <h1 style={{textAlign:"center", letterSpacing: "5px", fontFamily: "Arial, Helvetica, sans-serif", color: "white"}}>CLICK ANYWHERE TO BEGIN... THEN PRESS PLAY ON YOUR OPZ</h1>
      <h1 id="iterableEmoji" style={{textAlign:"center", fontSize: "90px"}}>💀</h1>
    </div>
  );
}

export default SingleChannel