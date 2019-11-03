import React from 'react';
const StartButton = (props) => {

    const startStyles = {
        margin: "30 left",
        width: "0",
        height: "0",
        borderLeft: "30px solid transparent",
        borderRight: "30px solid transparent",
        borderTop: "60px solid #e49a5b",
        marginLeft: "105px"
    }

    const handleclick = (event) => {
        props.onClick()
        event.target.style.borderTop = "60px solid gray"
    }

    return (
        <div className="triangle" onClick={handleclick} style={startStyles}></div>
    );
}

export default StartButton