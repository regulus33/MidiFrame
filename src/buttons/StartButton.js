import React from 'react';
const StartButton = (props) => {

    const startStyles = {
        margin: "0 auto",
        width: "0",
        height: "0",
        borderLeft: "50px solid transparent",
        borderRight: "50px solid transparent",
        borderTop: "100px solid #e49a5b",
    }

    return (
        <div onClick={props.onClick} style={startStyles}></div>
    );
}

export default StartButton