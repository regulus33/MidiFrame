import React from 'react'
const ActionButton = (props) => {
    return(
        <div style={{margin: '40px'}}>
            <span style={{border: "1px solid #c9c9c9", padding:"10px", cursor:"pointer"}} onClick={props.onClick}>{props.buttonText}</span>
        </div>
    )
}

export default ActionButton 