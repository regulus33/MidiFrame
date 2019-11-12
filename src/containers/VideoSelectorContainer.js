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
        this.state = {videoFiles:[], selectedVideoPath: "", selectedChannel: "", notes:{}, latestCapturedMidi:[]};
        //overwrite this to remain this instance when called in another class 
        this.renderOptionsForVideoDropDown = this.renderOptionsForVideoDropDown.bind(this);
        this.renderOptionsForChannelPickerData = this.renderOptionsForChannelPickerData.bind(this)
        this.handleVideoOptionClick = this.handleVideoOptionClick.bind(this)
        this.handleChannelOptionClick = this.handleChannelOptionClick.bind(this)
        this.handleTimeStampInput = this.handleTimeStampInput.bind(this)
        this.registerRefreshListener = this.registerRefreshListener.bind(this)
        //Subscribe midiCollector to the state, you will need it to update video based on midi events
        //remember not to touch this, passing by reference
    }  

    componentDidMount() {
        //listener for 'r'
        this.registerRefreshListener()
        this.fetchVideoFilePaths()
        //TODO setting default selected channel should be in the most early and rare occuring method 
        //sets selected channel to whatever is the first channel in the used notes object. 
        //TODO: nothing should appear on form until a midi option is clicked
    
    
    
        //    let chan = Object.keys(this.usedNotesAndChannels())[0]
    //    let usedNotes = this.usedNotesAndChannels()
    //    let notesBelongingToSelectedChannel
    //    notesBelongingToSelectedChannel = getNotesFromChannelInSuppliedObject(usedNotes, Number(this.state.selectedChannel))
    //    let channelsToNotes = usedNotes
    //    let selectedChannel = Number(this.state.selectedChannel)
    //    if(channelsToNotes[this.state.selectedChannel] == undefined) { 
    //     notesBelongingToSelectedChannel = []
    //     }else {
    //     notesBelongingToSelectedChannel = channelsToNotes[selectedChannel]
    //    }
      
    //    let notesTimes = {}
    //    //Set all these notes to blank as this is the first render 
    //    notesBelongingToSelectedChannel.forEach((e)=>{notesTimes[String[e]]=""})
    //    this.setState({selectedChannel: chan, notes: notesTimes})
    }

    getInitialValuesForNotes(channel) {
        let usedNotes = this.usedNotesAndChannels()
        let notesBelongingToSelectedChannel
        notesBelongingToSelectedChannel = getNotesFromChannelInSuppliedObject(usedNotes, Number(channel))
        let channelsToNotes = usedNotes
        let selectedChannel = Number(channel)
        if(channelsToNotes[channel] == undefined) { 
         notesBelongingToSelectedChannel = []
         }else {
         notesBelongingToSelectedChannel = channelsToNotes[channel]
        }
        let notesTimes = {}
        //Set all these notes to blank as this is the first render 
        notesBelongingToSelectedChannel.forEach((e)=>{notesTimes[String(e)]=""})
        return notesTimes
    }

    fetchVideoFilePaths() {
        this.props.videoSelectorGet().then(res => {
            res.json().then((r) => {
            //console.log(r)
                this.setState({videoFiles:r, selectedVideoPath: r.pop()})
            })
        })
    }
    
    // takes the midi that has been sent so far from opz to midi.js to the component's state.latestCapturedMidi (a collection of simple midi events)
    usedNotesAndChannels() {
        let capturedMidiData = this.state.latestCapturedMidi
        // let capturedMidiData = this.props.rawMidi
        let m = new MidiMapper
        let channelsNotes = m.determineUsedNotes(capturedMidiData)
        let formatted = reverseChannelsAndNotesObject(channelsNotes)
        return formatted
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

        this.setState({notes:noteTimeObj})
    }

    //no need to test for now 
    getTimeInputs() {
        return document.getElementsByClassName("noteTextField")
    }   

    handleChannelOptionClick(event) {
        //before we make changes to the state, save it, we will need it later
        this.props.midiCollector.updateState(this.state)
        // debugger
        let channelToSelect = event.target.selectedOptions[0].value
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
            return(<p>You haven't made the progrma aware of which notes you're using.</p>)
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
        document.onkeyup = (event) => { 
           if(event.key === "r"){
            console.log(this.setState)
            //makes it obvious that you changed something 
            document.getElementsByClassName("vidContainer")[0].style.backgroundColor = getRandomColor()
            this.setState({latestCapturedMidi: this.props.midiCollector.midiToBeMapped})
            console.log(this.state)  
          }
          if(event.key === "m"){
            this.props.midiCollector.startMidi()
          }
        }

    }

    render() {
        //console.log(this.state)
        //each time the form changes we need to notify the browsermidicollector 
        // Object.assign(this.props.midiCollector, this.state)
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