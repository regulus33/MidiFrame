import React from 'react'

export default class MidiRecorderContainer extends React.Component  {
   
    constructor(props) {
        super(props)
        this.onNoteRecorded = this.onNoteRecorded.bind(this)
        this.state = {
            lastNotes: []
        }
    }

    componentDidMount() {
        this.props.midiCollector.onNoteRecorded = this.onNoteRecorded
    }

    onNoteRecorded(noteData) {
        let noteDataArrayToCopy = this.state.lastNotes 
        noteDataArrayToCopy.push(noteData)
        this.setState({lastNotes: noteDataArrayToCopy})
    }

    displayNotes() {
        return this.state.lastNotes.map((e)=>{
            return(<p>{JSON.stringify(e)}</p>)
        })
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
                 <div id="data-zone" style={{width:"100%"}}>
                    {this.displayNotes()}
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