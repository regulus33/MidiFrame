
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  These are all the network calls, decoupled from the components for testability and brevity ////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const videoSelectorGet = () => {
    return fetch('http://localhost:3000/video-selector')
}

export const postMidiData = (data, clearDataFunction) => {

    alert(`posting ${JSON.stringify(data)}`)

    return fetch('http://localhost:3000/midi', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    }).then(()=>{
        alert('midi data posted')
    })
}

export const fetchVideoBlod = (data) => {
    const req = XMLHttpRequest();
    req.open('GET', 'video.mp4', true);
    req.responseType = 'blob'

}


    
