import { Controller } from "stimulus"
import { fetchVideoBlob } from "custom/video_loader"
import { requestFromCache, saveResponseInCache } from '../../custom/cache_manager'
import { MIME_MP4 } from '../../custom/constants'
import videojs from 'video.js'
export default class extends Controller {

  static targets = ["video", "loadingBar"]

  async connect() { 
    // replace URL with BLOB:URL after downloading, load bar is updated as well.
    let myPlayer    = videojs(this.videoTarget.id)
    
    let downloadUrl = myPlayer.src()
   
    let blob = await this.getVideoBlob(downloadUrl)
   
    const blobURL = URL.createObjectURL(blob)
    
    myPlayer.src({ src: blobURL, type: MIME_MP4 })
  }

  onDownloadProgress(bufferedPercent){
    this.loadingBarTarget.style.width = `${bufferedPercent}%`
  }

  async getVideoBlob(downloadUrl){ 
    let cachedBlob  = await requestFromCache(downloadUrl)
    if(cachedBlob) {
      return cachedBlob.blob()
    
    } else {
    
      let blob = await fetchVideoBlob({ downloadUrl: downloadUrl, onDownloadProgress: this.onDownloadProgress.bind(this)})
    
      saveResponseInCache(downloadUrl, blob)
    
      return blob 
    }
  
  }



  
  
}