
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  These are all the network calls, decoupled from the components for testability and brevity ////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const videoSelectorGet = () => {
    return fetch('http://localhost:3000/video-selector')
}

export const postMidiData = (data) => {
    debugger 
    return fetch('http://localhost:3000/midi', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });
}
    
