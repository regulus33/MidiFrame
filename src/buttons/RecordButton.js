import React from 'react';
const RecordButton = (clickListener) => {

    const recordStyles = {
        height: "60px",
        width: "60px",
        border: "1px solid black",
        backgroundColor: "#eb4f34",
        borderRadius: "50%",
        margin: "50px"
    }


    return (
        <div onClick={()=>{clickListener()}} style={recordStyles}></div>
    );
}

export default RecordButton