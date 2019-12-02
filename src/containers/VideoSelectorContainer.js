import React from 'react'
import VideoSelector from '../VideoSelector.js'
import Option from '../Option.js'
import ChannelPicker from '../ChannelPicker.js';
import MidiPlayerLive from '../classes/MidiPlayerLive'
import {
    getNotesFromChannelInSuppliedObject
} from '../Helpers.js'
import NoteTextField from '../NoteTextField'

class VideoSelecterContainer extends React.Component {

    constructor(props) {
        super(props) 
        
        this.firstUse = true 
        //for our array in assets s
        this.state = {
            videoFiles:[], 
            selectedVideoPath: "", 
            selectedChannel: "", 
            notes:{}, 
            refreshingMidi: false, 
            latestCapturedMidi:[]
        }
        //overwrite this to remain this instance when called in another class 
        this.renderOptionsForVideoDropDown = this.renderOptionsForVideoDropDown.bind(this);
        this.renderOptionsForChannelPickerData = this.renderOptionsForChannelPickerData.bind(this)
        this.handleVideoOptionClick = this.handleVideoOptionClick.bind(this)
        this.handleChannelOptionClick = this.handleChannelOptionClick.bind(this)
        this.handleTimeStampInput = this.handleTimeStampInput.bind(this)
        this.registerRefreshListener = this.registerRefreshListener.bind(this)
        this.repopulateRefresh = this.repopulateRefresh.bind(this)
        this.handleSaveClick = this.handleSaveClick.bind(this)
        this.handleRecordClick = this.handleRecordClick.bind(this)
        //Subscribe midiCollector to the state, you will need it to update video based on midi events
        //remember not to touch this, passing by reference
    } 

    componentDidMount() {

        this.firstUse = this.props.naviGatedToFromProjectManager ? false : true 
        
        console.log("the value of first use is: " + this.firstUse)
        this.repopulateRefresh()

        this.registerRefreshListener()
        
        this.fetchVideoFilePaths()
        //select default, this gets set in midicollector on first message
        //firs thtings first 
        let options = {}
            options["firstState"] = {
             selectedChannel: this.props.midiCollector.activeChannel, 
            notes: this.getInitialValuesForNotes(this.props.midiCollector.activeChannel),
            videoFiles: [],
            latestCapturedMidi: []
        }

        if(this.firstUse) {
            this.changeOrSetMidiChannel(this.props.midiCollector.activeChannel,options)
        } else {
            this.changeOrSetMidiChannel(this.props.midiCollector.activeChannel)
        }

        //part of the top part, since the form derives its content from latest captured midi, we need to set it somewhere
        
        this.firstUse = false 
    }

    getInitialValuesForNotes(channel) {
        let usedNotes = this.usedNotesAndChannels()
        let notesBelongingToSelectedChannel = getNotesFromChannelInSuppliedObject(usedNotes, channel)
        if(usedNotes[channel] == undefined) { 
         
        } else {
         notesBelongingToSelectedChannel = usedNotes[channel]
        }
        let notesTimes = {}
        //Set all these notes to blank as this is the first render 
        notesBelongingToSelectedChannel.forEach((e)=>{notesTimes[String(e)]=""})
        return notesTimes
    }

    fetchVideoFilePaths() {
        this.props.videoSelectorGet().then(res => {
            res.json().then((r) => {
                this.setState({videoFiles:r, selectedVideoPath: r[0]})
            })
        })
    }
    
    // takes the midi that has sbeen sent so far from opz to midi.js to the component's state.latestCapturedMidi (a collection of simple midi events)
    usedNotesAndChannels() {
        // let capturedMidiData = this.firstUse ? this.props.midiCollector.midiToBeMapped : this.state.latestCapturedMidi
        // let m = new MidiMapper
        // let channelsNotes = m.determineUsedNotes(capturedMidiData)
        // let formatted = reverseChannelsAndNotesObject(channelsNotes)
        // return formatted
        
        return this.props.midiCollector.getNotesAndChannels()
    }

    handleVideoOptionClick(event){
        this.setState({selectedVideoPath: event.target.selectedOptions[0].value})
    }   

    handleTimeStampInput(event){
        let noteTimeObj = {}
        
        let inputs = this.getTimeInputs()
        for(let i = 0; i < inputs.length; i++) {
            noteTimeObj[inputs[i].name] = inputs[i].value
        }
        //specific to this channel
        //{67: "1:03", 69: "", 72: "", 76: "", 79: ""}
        this.props.midiCollector.updateNotesForTimestampOnly(noteTimeObj)
        this.setState({notes:noteTimeObj})
    }

    handleSaveClick(){
        this.props.navigateToProjectManager()
    }

    handleRecordClick(){
        this.props.navigateToRecorderContainer()
        this.props.midiCollector.reconfigureMidiForRecording().then((d)=>{
        })
    }

    //no need to test for now 
    getTimeInputs() {
        return document.getElementsByClassName("noteTextField")
    }   

    handleChannelOptionClick(event) {
        this.changeOrSetMidiChannel(event.target.selectedOptions[0].value)
    }

    changeOrSetMidiChannel(channelToSelect,options={}) {
           
           //before we make changes to the state, save it, we will need it later
           if(options.firstState){
            this.props.midiCollector.updateState(options.firstState)
           } else {
            this.props.midiCollector.updateState(this.state)  
           }
           
           //if we have already recorded the notes and values for this channel, retrieve the values from midiCollector 
           if(
               this.props.midiCollector.midiData[channelToSelect].notes != undefined && 
               Object.keys(this.props.midiCollector.midiData[channelToSelect].notes).length > 0
           ) {
               this.setState({selectedChannel: channelToSelect, notes: this.props.midiCollector.midiData[channelToSelect].notes})
           } else {
               this.setState({selectedChannel: channelToSelect, notes: this.getInitialValuesForNotes(channelToSelect) }) 
           }
           
           //notify the collector that we have a new active channel (for live midi playing)
           //I guess we cant rely on the state just after setting it, it must be more of a promise than an actual function???
           this.props.midiCollector.activeChannelChange(channelToSelect)
    }

    renderOptionsForChannelPickerData() {
        //grab the midi dataaaaa    
        return Object.keys(this.usedNotesAndChannels()).map((c,index) => {
           return <Option key={index} keyToPass={c + index} value={c} displayName={c}/>
        })
    }
    //we need to reverse the channels:notes object
    // 7: [112,134]
    //
    renderNoteInputs() {
        if(Object.keys(this.state.notes) == 0){
            //notes is empty, return!
            return(<p style={{"color":"red"}}>There aren't any notes here, something is wrong</p>)
        }
        return Object.keys(this.state.notes).map((num, indexxx) => {
            return <NoteTextField value={this.state.notes[num]} key={indexxx} keyToPass={num + indexxx} noteName={num}/>
        })
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
    registerRefreshListener() {
        document.onkeydown = (event) => { 
            if(event.key === "r") {
             this.setState({refreshingMidi: true}) 
             document.getElementsByClassName("vidContainer")[0].style.backgroundColor = "red"

           } 
     
         }
         document.onkeyup = (event) => { 
            if(event.key === "r") {
            this.setState({refreshingMidi: false}) 
             document.getElementsByClassName("vidContainer")[0].style.backgroundColor = "white" 
           } 
     
         }

    }

    //this needs to be deleted 
    repopulateRefresh() {
        //this.setState({latestCapturedMidi: this.props.midiCollector.midiToBeMapped})
    }



    render() {
        console.log(this.state)
        //each time the form changes we need to notify the browsermidicollector 
        // Object.assign(this.props.midiCollector, this.state)
        return (
            <div className="vidContainer">
                <div className="formParent">
                    <div className="channelPicker">
                        <span className="description">pick the channel you want to modify</span>
                        <ChannelPicker 
                            handleChannelOptionClick={this.handleChannelOptionClick}
                            //todo:change the title of this props, makes no sense!
                            renderOptionsForVideoDropDown={this.renderOptionsForChannelPickerData}
                        />
                    </div>
                    <div className="noteSelector">
                    <span className="description">choose timestamps (3:33) from the video and add them to the note fields:</span>
                        <form onChange={this.handleTimeStampInput}>
                            {this.renderNoteInputs()}
                        </form>
                    </div>
                </div>
                <VideoSelector 
                    selectedChannelName={this.state.selectedChannel}
                    handleVideoOptionClick={this.handleVideoOptionClick} 
                    selectedVideoPath={this.state.selectedVideoPath} 
                    renderOptionsForVideoDropDown={this.renderOptionsForVideoDropDown} 
                />
                <button onClick={this.handleSaveClick}>save or load project</button>
                <button onClick={this.handleRecordClick}>Record Midiiiiii</button>
               
            </div>
        )
    }

}

export default VideoSelecterContainer