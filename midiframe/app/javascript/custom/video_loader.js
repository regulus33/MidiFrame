import videojs from 'video.js'
// https://javascript.info/fetch-progress
/////////////////////////////////////////////////////////////////////
/// SUMMARY: this function downloads vid and updates progress bar /// 
/////////////////////////////////////////////////////////////////////

export const fetchVideoBlob = async (videoTagId, onDownloadProgress) => {
  // vjsr reference 
  let myPlayer = videojs(videoTagId)
  /////////////////////////////////////////////////
  /// REMINDER:  this url might change with cdn //
  ////////////////////////////////////////////////
  let source = myPlayer.src()
  
  const response = await fetch(source)

  const reader = response.body.getReader();

  const contentLength = +response.headers.get('Content-Length');

  let chunks = []

  let receivedLength = 0; // received that many bytes at the moment
  
  while(true) {

    const {done, value} = await reader.read()
    
    if (done) break
    
    chunks.push(value)
    
    receivedLength += value.length;
    
    let percentDownloaded = Math.floor(( receivedLength / contentLength ) * 100 )
    
    onDownloadProgress(percentDownloaded)
  
  }

  let blob = new Blob(chunks)

  const blobURL = URL.createObjectURL(blob)
  /////////////////////////////////////////////////////////////
  /// REMINDER: hour video mime type needs to be restricted ///
  /////////////////////////////////////////////////////////////
  myPlayer.src({ src: blobURL, type: "video/mp4" })

  

}

