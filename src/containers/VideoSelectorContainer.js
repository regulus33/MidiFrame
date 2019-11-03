import React from 'react'
import VideoSelector from '../VideoSelector.js'
import Option from '../Option.js'
import MidiMapper from '../classes/MidiMapper.js'
import ChannelPicker from '../ChannelPicker.js';
import {
    reverseChannelsAndNotesObject,
    mergeArrays,
    getNotesFromChannelInSuppliedObject
} from '../Helpers.js'
import NoteTextField from '../NoteTextField'
import { thisExpression } from '@babel/types';
import BrowserMidiCollector from '../classes/BrowserMidiCollector.js';
import StartButton from '../buttons/StartButton.js'

class VideoSelecterContainer extends React.Component {

    constructor(props) {
        super(props);
        //for our array in assets s
        this.state = {videoFiles:[], selectedVideoPath: "", selectedChannel: "1", notes:{}};
        //overwrite this to remain this instance when called in another class 
        this.renderOptionsForDropDown = this.renderOptionsForDropDown.bind(this);
        this.renderOptionsForChannelPickerData = this.renderOptionsForChannelPickerData.bind(this)
        this.handleOptionClick = this.handleOptionClick.bind(this)
        this.handleChannelOptionClick = this.handleChannelOptionClick.bind(this)
        this.handleTypeTextChange = this.handleTypeTextChange.bind(this)
        //Subscribe midiCollector to the state, you will need it to update video based on midi events
        //remember not to touch this, passing by reference
        
    }  
    
    getUsedNotesObject() {
        let capturedMidiData = this.props.rawMidi
        let m = new MidiMapper
        let channelsNotes = m.determineUsedNotes(capturedMidiData)
        return reverseChannelsAndNotesObject(channelsNotes)
    }

    componentDidMount() {
        this.fetchVideoFilePaths()
        //TODO setting default selected channel should be in the most early and rare occuring method 
       this.setState({selectedChannel: Object.keys(this.getUsedNotesObject())[0]})
    }

    fetchVideoFilePaths() {
        this.props.videoSelectorGet().then(res => {
            res.json().then((r) => {
            console.log(r)
                this.setState({videoFiles:r, selectedVideoPath: r.pop()})
            })
        })
    }

    handleOptionClick(event){
        this.setState({selectedVideoPath: event.target.selectedOptions[0].value})
    }

    handleTypeTextChange(event){
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

    renderOptionsForChannelPickerData() {
        //grab the midi dataaaaa    
        return Object.keys(this.getUsedNotesObject()).map((c,index) => {
           return <Option key={index} keyToPass={c + index} value={c} displayName={c}/>
        })

    }

    renderNoteInputs() {
        let usedNotes = this.getUsedNotesObject()
        
        let notesBelongingToSelectedChannel = getNotesFromChannelInSuppliedObject(usedNotes, Number(this.state.selectedChannel))
        
        return notesBelongingToSelectedChannel.map( ( el,i ) => <NoteTextField key={i} keyToPass={el + i} noteName={el}/>)
    }

    renderOptionsForDropDown() {
        return this.state.videoFiles.map((address, index) => {
            let nameOfSelectedVideo = address.split("/").pop()
            return (
                <Option key={index} keyToPass={address + index} value={address} displayName={nameOfSelectedVideo}/>
            )
        })
    }

    render() {
        console.log(this.state)
        //each time the form changes we need to notify the browsermidicollector 
        Object.assign(this.props.midiCollector, this.state)
        return (
            <div className="vidContainer">
                <div className="formParent">
                    <div className="channelPicker">
                        <span className="description">pick the channel you want to modify</span>
                        <ChannelPicker 
                            handleChannelOptionClick={this.handleChannelOptionClick}
                            renderOptionsForDropDown={this.renderOptionsForChannelPickerData}
                        />
                    </div>
                    <div className="noteSelector">
                    <span className="description">choose timestamps (3:33) from the video and add them to the note fields:</span>
                        <form onChange={this.handleTypeTextChange}>
                            {this.renderNoteInputs()}
                        </form>
                    </div>
                    <span className="description">Start the process HERE? :)</span>
                    <StartButton onClick={this.props.midiCollector.startMidi}/>
                </div>
                <VideoSelector 
                    selectedChannelName={this.state.selectedChannel}
                    handleOptionClick={this.handleOptionClick} 
                    selectedVideoPath={this.state.selectedVideoPath} 
                    renderOptionsForDropDown={this.renderOptionsForDropDown} 
                />
               
            </div>
        )
    }

}

export default VideoSelecterContainer