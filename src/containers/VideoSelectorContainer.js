import React from 'react'
import VideoSelector from '../VideoSelector.js'

class VideoSelecterContainer extends React.Component {

    constructor(props) {
        super(props);
        //for our array in assets s
        this.state = {videoFiles:[]};
        this.renderOptionsForDropDown = this.renderOptionsForDropDown.bind(this);
    }

    componentDidMount(){
        this.fetchVideoFilePaths()
    }

    fetchVideoFilePaths() {
        this.props.videoSelectorGet().then(res => {
            console.log(res)
            res.json().then((r) => {
                this.setState({videoFiles:r})
            })
        })
    }

    renderOptionsForDropDown() {
        return this.state.videoFiles.map((address) => {
            let nameOfSelectedVideo = address.split("/").pop()
            return (
                <option value={address}>{nameOfSelectedVideo}</option>
            )
        })

    }

    render() {
        return (
          <VideoSelector renderOptionsForDropDown={this.renderOptionsForDropDown}/>
        )
    }

}

export default VideoSelecterContainer