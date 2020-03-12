import { Controller } from "stimulus"
import  { requestFromCache, saveResponseInCache }  from '../../custom/cache_manager'
import { MIME_MP4 } from '../../custom/constants'
import videojs from 'video.js'
import { ENABLE_CACHE } from '../../custom/constants'
export default class extends Controller {

  static targets = ["video", "loadingBar"]

  async connect() { 
    // replace URL with BLOB:URL after downloading, load bar is updated as well.
    let downloadUrl = this.src 
    console.log(this.src)
    let cachedBlob = await requestFromCache(downloadUrl)
    let blob 

    if(cachedBlob) {
      blob = await cachedBlob.blob()
    } else {
      blob = await this.fetchVideoBlob({ downloadUrl: downloadUrl})
      saveResponseInCache(downloadUrl, blob)
    }
    const blobURL = URL.createObjectURL(blob)
    this.src = { src: blobURL, type: MIME_MP4 }
  }

  get src(){
    return videojs(this.videoTarget.id).src()
  }

  set src(sourc){
    return videojs(this.videoTarget.id).src(sourc)
  }

  onDownloadProgress(bufferedPercent) {
    this.loadingBarTarget.style.width = `${bufferedPercent}%`
  }

  async fetchVideoBlob({downloadUrl}){

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
  
      this.onDownloadProgress(percentDownloaded)
    
    }
    return new Blob(chunks)
  }
  
  
}