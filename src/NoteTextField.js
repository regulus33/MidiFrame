import React from 'react'


const NoteTextField = props => {
    return (
        <div>
            <span style={{"color":"grey"}}>{props.noteName}</span> 
            <input className="noteTextField" type="text" name={props.noteName}/><br/>
        </div>
    )
}


export default NoteTextField