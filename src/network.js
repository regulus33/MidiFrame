
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

// var req = new XMLHttpRequest();
// req.open('GET', 'http://localhost:3000/video?video_path=/Users/zacharyrowden/Desktop/notes/assets/video_bank/VID_20191204_063727.mp4', true);
// req.responseType = 'blob';

// let video = document.getElementsByTagName('video')[0]

// req.onload = function() {
//    // Onload is triggered even on 404
//    // so we need to check the status code
//    if (this.status === 200) {
//        console.log("success")
//       var videoBlob = this.response;
//       var vid = URL.createObjectURL(videoBlob); // IE10+
//       // Video is now downloaded
//       // and we can set it as source on the video element
//        console.log(vid)
//       video.src = vid;
//    }
// }
// req.onerror = function() {
//    // Error
// }

// req.send();
    
