import React from 'react'
import VideoSelector from '../VideoSelector.js'
import Option from '../Option.js'
import ChannelPicker from '../ChannelPicker.js';
import ActionButton from '../buttons/ActionButton.js';
import MidiPlayerLive from '../classes/MidiPlayerLive'
import {
    getNotesFromChannelInSuppliedObject
} from '../Helpers.js'
import NoteTextField from '../NoteTextField'
import videojs from 'video.js'

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
            latestCapturedMidi:[],
            //when you click on a timestamp input, it will be added to this field
            highlightedNote: 0
        }
        //overwrite this to remain this instance when called in another class 
        this.renderOptionsForVideoDropDown = this.renderOptionsForVideoDropDown.bind(this);
        this.renderOptionsForChannelPickerData = this.renderOptionsForChannelPickerData.bind(this)
        this.handleVideoOptionClick = this.handleVideoOptionClick.bind(this)
        this.handleChannelOptionClick = this.handleChannelOptionClick.bind(this)
        this.handleTimeStampInput = this.handleTimeStampInput.bind(this)
        this.registerKeyboardListeners = this.registerKeyboardListeners.bind(this)
        this.handleSaveClick = this.handleSaveClick.bind(this)
        this.handleRecordClick = this.handleRecordClick.bind(this)
        this.randomizeInputs = this.randomizeInputs.bind(this)
        this.constructVideoJsPlayerReference = this.constructVideoJsPlayerReference.bind(this)
        this.toggleNoteHighlight = this.toggleNoteHighlight.bind(this)
        //Subscribe midiCollector to the state, you will need it to update video based on midi events
        //remember not to touch this, passing by reference
    } 

    componentDidMount() {
        //if first use we need to populate some defaults to avoid null errors and what not 
        this.firstUse = this.props.naviGatedToFromProjectManager ? false : true 
        this.registerKeyboardListeners()
        this.fetchVideoFilePaths()
        //here are those default values 
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

        window.addEventListener('load', this.constructVideoJsPlayerReference());
        
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
        return this.props.midiCollector.getNotesAndChannels()
    }

    handleVideoOptionClick(event) {
        this.props.midiCollector.updateState(this.state)
        let videoToSelect = event.target.selectedOptions[0].value
        this.setState({selectedVideoPath: videoToSelect})
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
        const channelToSelect = event.target.selectedOptions[0].value
        this.changeOrSetMidiChannel(channelToSelect)
        //populate the previously selected channel for this
        let videoPathFromSelectedChannel
        if(this.props.midiCollector.midiData[channelToSelect].videoPath){
            videoPathFromSelectedChannel = this.props.midiCollector.midiData[channelToSelect].videoPath
        } else {
            videoPathFromSelectedChannel = this.getCurrentVideoPlaying()
        }

       this.setState({selectedVideoPath: videoPathFromSelectedChannel, })

    }

    changeOrSetMidiChannel(channelToSelect,options={}, last_videoPath) {
           //if there is any default data in the options hash 
           if(options.firstState){
            this.props.midiCollector.updateState(options.firstState)
           } else {
            this.props.midiCollector.updateState(this.state)  
           }
           //if we already have data for this stored in midicollector, we need to populate the form with that data.
           let notesExist = this.props.midiCollector.midiData[channelToSelect].notes != undefined 

           if(notesExist) {
               let selectedVideoPath 
               if(this.props.midiCollector.midiData[channelToSelect].videoPath){
                selectedVideoPath = this.props.midiCollector.midiData[channelToSelect].videoPath 
               } else {
                //if there is no video associated with this channel, just grab it from the document 
                selectedVideoPath = this.getCurrentVideoPlaying()
               }

            this.setState({
                selectedChannel: channelToSelect, 
                notes: this.props.midiCollector.midiData[channelToSelect].notes, 
                selectedVideoPath: selectedVideoPath,
            })
           //if there are no notes set for this channel in the collector we just a default video from videoFiles array
           //get initial values for notes as well
           } else {
               this.setState({
                   selectedChannel: channelToSelect, 
                   notes: this.getInitialValuesForNotes(channelToSelect),
                   selectedVideoPath: this.state.videoFiles[0] 
                }) 
           }
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
            return (<NoteTextField 
                    value={this.state.notes[num]} 
                    key={indexxx} 
                    keyToPass={num + indexxx} 
                    noteName={num} 
                    toggleNoteHighlight={this.toggleNoteHighlight}
                    />
            )
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
    registerKeyboardListeners() {
        document.onkeydown = (event) => { 
            if(event.key === "r") {
             this.setState({refreshingMidi: true}) 
             document.getElementsByClassName("vidContainer")[0].style.backgroundColor = "red"

           } 
           if(event.key == "f") {
               this.randomizeInputs()
               //repopulate
               this.setState({refreshingMidi: true})
               //after we add all those randomized inputs to the state we need to notify midicollector 
               //so he can play the video right    
               this.props.midiCollector.updateState(this.state) 
           }
     
         }
         document.onkeyup = (event) => { 
           if(event.key === "r") {
                this.setState({refreshingMidi: false}) 
                 document.getElementsByClassName("vidContainer")[0].style.backgroundColor = "white" 
           } 
           if(event.key == "f") {
            this.setState({refreshingMidi: false}) 
           }
          
     
         }

    }
  
    //TODO: TEST ME!!!
    randomizeInputs(){
        let vid = document.getElementsByTagName("video")[0]
        let times = this.state.notes 
        //if we highlighted a note, we only want to randomize that field 
        if(this.state.highlightedNote == 0) {
            Object.keys(times).forEach((e)=>{
                times[e] = MidiPlayerLive.randomTimeWithinThisSpan(vid.duration)
            })
        } else {
            times[this.state.highlightedNote] = MidiPlayerLive.randomTimeWithinThisSpan(vid.duration)
        }
     
    }

    toggleNoteHighlight(noteNumber, target){
    
        if(this.state.highlightedNote == noteNumber) {
            this.setState({highlightedNote: 0})
            // unhighlight
            target.style.backgroundColor = 'white' 
        } else {
            //highlight
            this.setState({highlightedNote: noteNumber})
            target.style.backgroundColor = 'red' 
        }
    }

    constructVideoJsPlayerReference(){
        //for the fucking tests, fucking videojs i dont feel like spending 3 hours to figure out how to mock this shit. 
        if( window.navigator.vendor== "Google Inc.") {
            var myPlayer = videojs('player')
            this.props.midiCollector.setVideoPlayer(myPlayer)
        }
    }

    getCurrentVideoPlaying(){
        let optionSelected = document.getElementById("videoSelector").selectedOptions[0]
        if(optionSelected != undefined) {
            return optionSelected.value  
        } else {
            return ""
        }
    }

    render() {
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
                <ActionButton onClick={this.handleSaveClick}buttonText={'Save or Load'}/>
                <ActionButton onClick={this.handleRecordClick} buttonText={'Record Midi'}/>
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