import { Controller } from "stimulus"
import  { requestFromCache, saveResponseInCache }  from '../../helpers/cacheing_functions'
import { MIME_MP4 } from '../../helpers/constants'
import videojs from 'video.js'
import { ENABLE_CACHE } from '../../helpers/constants'

export default class extends Controller {

  static targets = ["video", "loadingBar", "progressContainer"]

  async connect() { 
    //DELETE BELOW LINE 
    // this.src 
    // UNCOMMENT TO BRING BACK DL 
    this._video.hide()
    let blob = await this.blob()
    const blobURL = URL.createObjectURL(blob)
    this.src = { src: blobURL, type: MIME_MP4 }
    this._video.show()
  }

  get src() {
    return this._video.src()
  }

  set src(source) {
    return this._video.src(source)
  }

  get _video(){
    return videojs(this.videoTarget.id)
  }

  async cachedVideo() {
    let v = requestFromCache(this.src)
    if(v){
      return v 
    }
    return await requestFromCache(this.src) && await requestFromCache(this.src).blob()
  }

  onDownloadProgress(bufferedPercent) {
    this.loadingBarTarget.style.width = `${bufferedPercent}%`
    console.log(bufferedPercent)
  }

  async blob() {
    let b 
    if(this.cachedVideoBlob){
    // if(false){
        b = this.cachedVideoBlob
    } else {
      b = this.fetchVideoBlob({ downloadUrl: this.src}) 
      saveResponseInCache(this.src, b)
    }
    return b 
  }
 
  async fetchVideoBlob({downloadUrl}) {
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
    this.progressContainerTarget.style.display = 'none'
    return new Blob(chunks)
  }
  
  
}