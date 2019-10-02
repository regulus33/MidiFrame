import React from 'react'


const ChannelPicker = props => {
    return (
        <div style={{ width: "100%", margin: "auto" }}>
            <select onChange={props.handleOptionClick}>
                {props.renderOptionsForDropDown()}
            </select>
        </div>
    )
}


export default ChannelPicker