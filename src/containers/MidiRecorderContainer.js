import React from 'react'

export default class MidiRecorderContainer extends React.Component  {
    constructor(props){
        super(props)

    }

    componentDidMount(){
        
    }

    render(){
        return(
            <div className="vidContainer">
                <h1>Midi Recorder</h1>
                 <label>BARS:</label>
                 <input style={{width:"100%"}} type="text"></input>
                 <button style={{width:"100%",height:"45px",marginTop:"20px", backgroundColor:"#ff6699"}}>R E C O R D</button>
                 <p>Maybe send a midi sysex message telling the opz to play here when we hit record?</p>
                 <p>Even cooler, per each clock signal, or every 5 clock signals whatever makes more sense, draw a small rectangle accross the page</p>
                 <div style={{width:"100%"}}>
                    <span style={{margin: "30px"}} id="dot1">🈹</span>
                    <span style={{margin: "30px"}} id="dot2">🈹</span>
                    <span style={{margin: "30px"}} id="dot3">🈹</span>
                    <span style={{margin: "30px"}} id="dot4">🈹</span>
                    <span style={{margin: "30px"}} id="dot5">🈹</span>
                    <span style={{margin: "30px"}} id="dot6">🈹</span>
                    <span style={{margin: "30px"}} id="dot7">🈹</span>
                    <span style={{margin: "30px"}} id="dot8">🈹</span>
                    <span style={{margin: "30px"}} id="dot9">🈹</span>
                    <span style={{margin: "30px"}} id="dot10">🈹</span>
                    <span style={{margin: "30px"}} id="dot11">🈹</span>
                    <span style={{margin: "30px"}} id="dot12">🈹</span>
                    <span style={{margin: "30px"}} id="dot13">🈹</span>
                    <span style={{margin: "30px"}} id="dot14">🈹</span>
                    <span style={{margin: "30px"}} id="dot15">🈹</span>
                    <span style={{margin: "30px"}} id="dot16">🔔</span>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <button style={{width:"100%",height:"45px",marginTop:"20px", backgroundColor:"#ff6699"}}>C R E A T E</button>
            </div>

        )
    }
}