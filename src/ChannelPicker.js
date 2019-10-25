import React from 'react'


const ChannelPicker = props => {
    return (
        <div style={{ width: "100%", margin: "auto" }}>
            <span>channel:</span>
            <select onChange={props.handleChannelOptionClick}>
                {props.renderOptionsForDropDown()}
            </select>
        </div>
    )
}


export default ChannelPicker