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
import MidiFormScraper from '../classes/MidiFormScraper.js';

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
    }  
    
    getUsedNotesObject() {
        let capturedMidiData = this.props.rawMidi
        let m = new MidiMapper
        let channelsNotes = m.determineUsedNotes(capturedMidiData)
        return reverseChannelsAndNotesObject(channelsNotes)
    }

    componentDidMount() {
        this.fetchVideoFilePaths()
    }

    fetchVideoFilePaths() {
        this.props.videoSelectorGet().then(res => {
            res.json().then((r) => {
            console.log(r)
                this.setState({videoFiles:r})
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
        //call the scraper, when render runs it meanss state has changed 
        let singletonFormDataMidi = new MidiFormScraper //singleton instance
        singletonFormDataMidi.commitState(this.state)
        return (
            <div className="vidContainer">
                 <ChannelPicker 
                    handleChannelOptionClick={this.handleChannelOptionClick}
                    renderOptionsForDropDown={this.renderOptionsForChannelPickerData}
                />
                <VideoSelector 
                    selectedChannelName={this.state.selectedChannel}
                    handleOptionClick={this.handleOptionClick} 
                    selectedVideoPath={this.state.selectedVideoPath} 
                    renderOptionsForDropDown={this.renderOptionsForDropDown} 
                />
                <form onChange={this.handleTypeTextChange}>
                    {this.renderNoteInputs()}
                </form>
            </div>
        )
    }

}

export default VideoSelecterContainer