
import { requestFromCache } from './cache_manager'
// https://javascript.info/fetch-progress
/////////////////////////////////////////////////////////////////////
/// SUMMARY: this function downloads vid and updates progress bar /// 
/////////////////////////////////////////////////////////////////////

export const fetchVideoBlob = async ({onDownloadProgress, downloadUrl}) => {

  const response      = await fetch(downloadUrl)
  const reader        = response.body.getReader();
  const contentLength = +response.headers.get('Content-Length');
  let chunks          = []
  let receivedLength  = 0 // received that many bytes at the moment
  
  while(true) {
    const {done, value} = await reader.read()

    chunks.push(value)

    if (done) break

    // notify UI of percent downloaded on each 
    receivedLength += value.length;

    let percentDownloaded = Math.floor(( receivedLength / contentLength ) * 100 )

    console.log(percentDownloaded)

    onDownloadProgress(percentDownloaded)
  
  }

  return new Blob(chunks)
}





