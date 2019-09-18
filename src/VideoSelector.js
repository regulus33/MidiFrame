import React from 'react'


const VideoSelecter = props => {

    return (
        <div style={{ width: "100%", margin: "auto" }}>
            <select>
                {props.renderOptionsForDropDown()}
            </select>
        </div>
    )
}


export default VideoSelecter