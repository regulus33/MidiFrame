import React from 'react'

const splash = (props) => {
    let markup = ""
    let style = {"textAlign":"center"}
    switch(props.appState){
        case "SHOW_PRESS_M":
        markup = (<h1 style={style}>PRESS M KEY</h1>)
        break;
        case "SHOW_PLAY_MIDI":
        markup = (<h1 style={style}>PLAY SOME MIDI NOTES THEN HIT "ENTER"</h1>)
        break;
    }
    return (
        <div>
            {markup}
            <span style={style}>{props.userMessage}</span>
        </div>
    )
}

export default splash 