import React from "react"

class VideoDisplayer extends React.Component {
    
    constructor(props){
        super(props)
    }
    
    
    render(){
        return(
        <div>
            <video>
                <source src={this.props.videoPath} type={`video/${this.props.fileExtension}`}/>
            </video>
        </div>
        )
    }
} 

export default VideoDisplayer