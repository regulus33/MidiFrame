import React from "react"

const VideoDisplayer = (props) => {
        return(
            <div className="vidDisplayer">
            <h1>{props.selectedChannelName}</h1>
                <video controls autoPlay name="media" src={`http://localhost:3000/video?video_path=${props.videoPath}`} type={`video/${props.videoPath.split(".").pop()}`}>
                </video>
            </div>
        )
}

export default VideoDisplayer