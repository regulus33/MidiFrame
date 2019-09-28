import React from 'react'
import VideoDisplayer from './VideoDisplayer.js'


const VideoSelecter = props => {

    return (
        <div style={{ width: "100%", margin: "auto" }}>
            <select onChange={props.handleOptionClick}>
                {props.renderOptionsForDropDown()}
            </select>
            <VideoDisplayer videoPath={props.selectedVideoPath}/>
        </div>
    )
}


export default VideoSelecter