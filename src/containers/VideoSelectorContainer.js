import React from 'react'
import VideoSelector from '../VideoSelector.js'
import Option from '../Option.js'

class VideoSelecterContainer extends React.Component {

    constructor(props) {
        super(props);
        //for our array in assets s
        this.state = {videoFiles:[], selectedVideoPath: ""};
        //overwrite this to remain this instance when called in another class 
        this.renderOptionsForDropDown = this.renderOptionsForDropDown.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this)
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
        return (
            <VideoSelector handleOptionClick={this.handleOptionClick} selectedVideoPath={this.state.selectedVideoPath} renderOptionsForDropDown={this.renderOptionsForDropDown}/>
        )
    }

}

export default VideoSelecterContainer