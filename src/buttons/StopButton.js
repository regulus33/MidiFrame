import React from 'react';
const StopButton = (onClick) => {

    const stopStyles = {
        height: "60px",
        width: "60px",
        border: "1px solid black",
        backgroundColor: "#555",
        backgroundColor: "#f2f2d5",
        margin: "50px"
    }


    return (
        <div style={stopStyles}></div>
    );
}

export default StopButton