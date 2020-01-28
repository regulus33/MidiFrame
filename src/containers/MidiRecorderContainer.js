import React from 'react'

export default class MidiRecorderContainer extends React.Component  {
   
    constructor(props) {
        super(props)
        this.onNoteRecorded = this.onNoteRecorded.bind(this)
        this.state = {
            lastNotes: [],
            bars: 0, 
        }
        
        this.onBarsInput = this.onBarsInput.bind(this)
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
        this.setState({
            bars: event.target.value
        })
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