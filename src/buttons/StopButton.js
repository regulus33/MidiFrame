import React from 'react';
const StopButton = (props) => {

    const stopStyles = {
        height: "60px",
        width: "60px",
        border: "1px solid black",
        backgroundColor: "#f2f2d5",
        margin: "50px"
    }


    return (
        <div onClick={props.onClick} style={stopStyles}></div>
    );
}

export default StopButton