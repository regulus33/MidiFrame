import React from 'react';
const StartButton = (clickHanlder) => {

    const startStyles = {
        margin: "0 auto",
        width: "0",
        height: "0",
        borderLeft: "50px solid transparent",
        borderRight: "50px solid transparent",
        borderTop: "100px solid #e49a5b",
    }

    const startButton = (event) => {
        event.target.style["borderTop"] = "100px solid grey"
    }

    return (
        <div onClick={startButton} style={startStyles}></div>
    );
}

export default StartButton