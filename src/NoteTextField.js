import React from 'react'


const NoteTextField = props => {
    return (
        <div>
            {/* on click pass the notenumber back to video selector container. We'll use it the highlight the note in case you want to do a function with it */}
            <span onClick={(event) => {props.toggleNoteHighlight(props.noteName, event.target)}} style={{"color":"grey"}}>{props.noteName}</span> 
            <input 
                onBlur={props.handleTimeStampInput} 
                className="noteTextField" 
                type="text" 
                name={props.noteName} 
                value={props.value}/>
            <br/>
        </div>
    )
}


export default NoteTextField