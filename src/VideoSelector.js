import React from 'react'
import VideoDisplayer from './VideoDisplayer.js'


const VideoSelecter = props => {

    return (
        <div style={{ width: "100%", margin: "auto" }}>
            <span className="description">choose a video to bind the midi data to:</span><br/>
            <span>video:</span>
            <select onChange={props.handleOptionClick}>
                {props.renderOptionsForDropDown()}
            </select>
            <VideoDisplayer selectedChannelName={props.selectedChannelName} videoPath={props.selectedVideoPath}/>
        </div>
    )
}


export default VideoSelecter