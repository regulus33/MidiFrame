import React from 'react'
import VideoSelector from '../VideoSelector.js'
import Option from '../Option.js'
import MidiMapper from '../classes/MidiMapper.js'
import ChannelPicker from '../ChannelPicker.js';
import {
    reverseChannelsAndNotesObject,
    getRandomColor,
    getNotesFromChannelInSuppliedObject
} from '../Helpers.js'
import NoteTextField from '../NoteTextField'
import StartButton from '../buttons/StartButton.js'

class VideoSelecterContainer extends React.Component {

    constructor(props) {
        super(props);
        //for our array in assets s
        this.state = {videoFiles:[], selectedVideoPath: "", selectedChannel: "1", notes:{}, latestCapturedMidi:[]};
        //overwrite this to remain this instance when called in another class 
        this.renderOptionsForVideoDropDown = this.renderOptionsForVideoDropDown.bind(this);
        this.renderOptionsForChannelPickerData = this.renderOptionsForChannelPickerData.bind(this)
        this.handleVideoOptionClick = this.handleVideoOptionClick.bind(this)
        this.handleChannelOptionClick = this.handleChannelOptionClick.bind(this)
        this.handleTimeStampInput = this.handleTimeStampInput.bind(this)
        //Subscribe midiCollector to the state, you will need it to update video based on midi events
        //remember not to touch this, passing by reference
    }  
    
    // takes the midi that has been sent so far from opz to midi.js to the component's state.latestCapturedMidi (a collection of simple midi events)
    getUsedNotesObject() {
        let capturedMidiData = this.state.latestCapturedMidi
        // debugger 
        // let capturedMidiData = this.props.rawMidi
        let m = new MidiMapper
        let channelsNotes = m.determineUsedNotes(capturedMidiData)
        let formatted =  reverseChannelsAndNotesObject(channelsNotes)
        return formatted
    }

    componentDidMount() {
        //listener for 'r'
        this.handleRefreshClick()
        this.fetchVideoFilePaths()
        //TODO setting default selected channel should be in the most early and rare occuring method 
       this.setState({selectedChannel: Object.keys(this.getUsedNotesObject())[0]})
    }

    fetchVideoFilePaths() {
        this.props.videoSelectorGet().then(res => {
            res.json().then((r) => {
            //console.log(r)
                this.setState({videoFiles:r, selectedVideoPath: r.pop()})
            })
        })
    }

    handleVideoOptionClick(event){
        this.setState({selectedVideoPath: event.target.selectedOptions[0].value})
    }

    handleTimeStampInput(event){
        let noteTimeObj = {}
        
        let inputs = document.getElementsByClassName("noteTextField")
        for(let i = 0; i < inputs.length; i++) {
            noteTimeObj[inputs[i].name] = inputs[i].value 
        }

        this.setState({notes:noteTimeObj})
    }

    handleChannelOptionClick(event) {
        this.setState({selectedChannel: event.target.selectedOptions[0].value})
    }
    //////// I"M NEXTTTTTTT
    renderOptionsForChannelPickerData() {
        //grab the midi dataaaaa    
        return Object.keys(this.getUsedNotesObject()).map((c,index) => {
           return <Option key={index} keyToPass={c + index} value={c} displayName={c}/>
        })

    }
    //we need to reverse the channels:notes object
    // 7: [112,134]
    //
    renderNoteInputs() {
        let usedNotes = this.getUsedNotesObject()
        
        let notesBelongingToSelectedChannel = getNotesFromChannelInSuppliedObject(usedNotes, Number(this.state.selectedChannel))
        
        return notesBelongingToSelectedChannel.map( ( el,i ) => <NoteTextField key={i} keyToPass={el + i} noteName={el}/>)
    }

    renderOptionsForVideoDropDown() {
        return this.state.videoFiles.map((address, index) => {
            let nameOfSelectedVideo = address.split("/").pop()
            return (
                <Option key={index} keyToPass={address + index} value={address} displayName={nameOfSelectedVideo}/>
            )
        })
    }
    //when user hits r we refresh the incoming midi data
    handleRefreshClick() {
        document.onkeyup = (event) => { 
           if(event.key === "r"){
            //makes it obvious that you changed something 
            document.getElementsByClassName("vidContainer")[0].style.backgroundColor = getRandomColor()
            this.setState({latestCapturedMidi: this.props.midiCollector.midiToBeMapped})
           }
        }

    }

    render() {
        //console.log(this.state)
        //each time the form changes we need to notify the browsermidicollector 
        Object.assign(this.props.midiCollector, this.state)
        return (
            <div className="vidContainer">
                <div className="formParent">
                    <div className="channelPicker">
                        <span className="description">pick the channel you want to modify</span>
                        <ChannelPicker 
                            handleChannelOptionClick={this.handleChannelOptionClick}
                            renderOptionsForVideoDropDown={this.renderOptionsForChannelPickerData}
                        />
                    </div>
                    <div className="noteSelector">
                    <span className="description">choose timestamps (3:33) from the video and add them to the note fields:</span>
                        <form onChange={this.handleTimeStampInput}>
                            {this.renderNoteInputs()}
                        </form>
                    </div>
                    <span className="description">Start the process HERE? :)</span>
                    <StartButton onClick={this.props.midiCollector.startMidi}/>
                </div>
                <VideoSelector 
                    selectedChannelName={this.state.selectedChannel}
                    handleVideoOptionClick={this.handleVideoOptionClick} 
                    selectedVideoPath={this.state.selectedVideoPath} 
                    renderOptionsForVideoDropDown={this.renderOptionsForVideoDropDown} 
                />
               
            </div>
        )
    }

}

export default VideoSelecterContainer