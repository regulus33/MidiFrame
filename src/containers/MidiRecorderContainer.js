import React from 'react'
import MidiCounter from '../classes/MidiCounter'

export default class MidiRecorderContainer extends React.Component  {
   
    constructor(props) {
        super(props)
        this.onNoteRecorded = this.onNoteRecorded.bind(this)
        this.state = {
            lastNotes: [],
            bars: 0, 
            bpm: 0, 
            clip_length: 0, 
        }
        
        this.onBarsInput = this.onBarsInput.bind(this)
        this.onBPMInput = this.onBPMInput.bind(this)
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

    onBarsInput(event) {
        let lengthOfClip = MidiCounter.getLengthInMilSecondsOfClip(event.target.value, this.state.bpm)
        this.setState({
            bars: event.target.value,
            clip_length: lengthOfClip
        })

        this.props.midiCollector.updatePatternDuration(lengthOfClip)
    }

    onBPMInput(event) {
        let lengthOfClip = MidiCounter.getLengthInMilSecondsOfClip(this.state.bars, event.target.value)

        this.setState({
            bpm: event.target.value, 
            clip_length: lengthOfClip
        })

        this.props.midiCollector.updatePatternDuration(lengthOfClip)
    }

    

    render(){

        //update the midicounter tool used in midi collector 
        //need it for auto starting and stopping 
        this.props.midiCollector.barCountForRecording = this.state.bars
        console.log('[INPUT] ' + this.props.midiCollector.barCountForRecording)
        return(
            <div className="vidContainer">
                <h1>Midi Recorder</h1>
                 <label>BARS:</label>
                 <input style={{width:"100%"}} type="text" onBlur={this.onBarsInput} ></input>
                 <label>BPM:</label>
                 <input style={{width:"100%"}} type="text" onBlur={this.onBPMInput} ></input>
                 <h1>Clip Duration: {this.state.clip_length} </h1>
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
            </div>

        )
    }
}