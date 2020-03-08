import videojs from 'video.js'
                          //video controller nows about the video tag and passes a callback 
export const waitForVideoToLoad = (videoTagId, onDownloaded) => {
  let myPlayer = videojs(videoTagId)

  /// Wait until player is fully loaded to play()
  myPlayer.on("progress", () => {

    if(myPlayer.bufferedPercent() > 0){
      onDownloaded(myPlayer.bufferedPercent())
    }
  })
}



