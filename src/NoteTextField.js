import React from 'react'


const NoteTextField = props => {
    return (
        <div>
            <span style={{"color":"white"}}>{props.noteName}</span><br/>
            <input className="noteTextField" type="text" name={props.noteName}/><br/>
        </div>
    )
}


export default NoteTextField