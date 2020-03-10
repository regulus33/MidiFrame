import { Controller } from "stimulus"
import { fetchVideoBlob } from "custom/video_loader"
export default class extends Controller {

  static targets = ["video", "loadingBar"]

  connect(){

   fetchVideoBlob(this.videoTarget.id, this.onDownloadProgress.bind(this)) 

  }

  onDownloadProgress(bufferedPercent){
    this.loadingBarTarget.style.width = `${bufferedPercent}%`
  }
  
}