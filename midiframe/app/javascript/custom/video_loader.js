import videojs from 'video.js'
                          //video controller nows about the video tag and passes a callback 
export const waitForVideoToLoad = async (videoTagId, onDownloaded) => {
  let myPlayer = videojs(videoTagId)
  
  let source = "http://localhost:3000" + myPlayer.src()
  
  const response = await fetch(source)

  const blob = await response.blob()

  const blobURL = URL.createObjectURL(blob)

  myPlayer.src({ src: blobURL, type: "video/mp4" });
  
  showProgress(response, onDownloaded)
  
}
//ALMOST THERE!!! PROBLEM IS JUST THAT SHOWPROGRESS IS SYNC FROM DOWNLOAD
//COPY THIS https://javascript.info/fetch-progress
const showProgress = async(response, onDownloaded) => {
  const reader = response.body.getReader();
  const contentLength = +response.headers.get('Content-Length');
  // read the data
  let receivedLength = 0; // received that many bytes at the moment
  while(true) {
    const {done, value} = await reader.read()
    if (done) {
      break
    }
    receivedLength += value.length;
    console.log(`Received ${receivedLength} of ${contentLength}`)
    let percentDownloaded = Math.floor(( receivedLength / contentLength ) * 100 )
    console.log(percentDownloaded)
    onDownloaded(percentDownloaded)
  }
  
}



// const fetchWholeVideo = (myPlayer) => {
//   // const req = new XMLHttpRequest()
//   //FIX ME 
//   let source = "http://localhost:3000" + myPlayer.src()
  
//   let response = fetch(source)
//     .then(result => result.blob())
//     .then(blob => {
//       const blobURL = URL.createObjectURL(blob);
    
//       // Doesn't work
//       // myPlayer.src(blobURL);
//       debugger
//       // Works
//       myPlayer.src({ src: blobURL, type: "video/mp4" });
//     }
//   )
//    debugger
// }





