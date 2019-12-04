import React from 'react'
const ActionButton = (props) => {
    return(
        <div style={{margin: '40px', width: '100%'}}>
            <span style={{width: "40px", border: "1px solid #c9c9c9", padding:"10px", cursor:"pointer", textAlign: "center"}} onClick={props.onClick}>{props.buttonText}</span>
        </div>
    )
}

export default ActionButton 