import React from 'react'


const NoteTextField = props => {
    return (
        <form>
            <span style={{"color":"white"}}>{props.noteName}</span><br/>
            <input type="text" name={props.noteName}/><br/>
        </form>
    )
}


export default NoteTextField