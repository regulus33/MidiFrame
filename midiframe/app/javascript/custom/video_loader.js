import videojs from 'video.js'
                          //video controller nows about the video tag and passes a callback 
export const waitForVideoToLoad = (videoTagId, onDownloaded) => {
  let myPlayer = videojs(videoTagId)
  fetchWholeVideo(myPlayer)
  // /// Wait until player is fully loaded to play()
  myPlayer.on("progress", () => {

    if(myPlayer.bufferedPercent() > 5){
      onDownloaded(myPlayer.bufferedPercent())
    }
  })
}

// JUST DEFAULT A LOADING BAR TIL THIS IS COMPLETE 
// TODO CACHEING WITH OR WITHOUT SERVICE WORKER. 
// EVENTUALLY WE CAN DO PARTIAL CONTENT. ADAPTIVELY LOAD THE VIDEO AND MAKE THE TIMELINE LONGER AS THE VIDEO GROWS
// AGAIN! THATS A STRETCH GOAL
const fetchWholeVideo = (myPlayer) => {
  // const req = new XMLHttpRequest()
  //FIX ME 
  let source = "http://localhost:3000" + myPlayer.src()
  
  fetch(source)
    .then(result => result.blob())
    .then(blob => {
      const blobURL = URL.createObjectURL(blob);
    
      // Doesn't work
      // myPlayer.src(blobURL);
      debugger
      // Works
      myPlayer.src({ src: blobURL, type: "video/mp4" });
    }
  )

}





