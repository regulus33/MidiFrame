import React from "react"

const VideoDisplayer = (props) => {
        return(
            <div className="vidDisplayer">
            <h1>editing notes on midi channel <span style={{"color": "#f5da42", "fontSize":"40px"}}>{props.selectedChannelName}</span></h1>
                <video id="player" controls autoPlay name="media" src={`http://localhost:3000/video?video_path=${props.videoPath}`} type={`video/${props.videoPath.split(".").pop()}`}>
                </video>
            </div>
        )
        
}

export default VideoDisplayer