import { Controller } from "stimulus"
import { waitForVideoToLoad } from "custom/video_loader"
export default class extends Controller {

  static targets = ["video", "loadingBar"]

  connect(){

   waitForVideoToLoad(this.videoTarget.id, this.onVideoDownloaded.bind(this)) 

  }

  onVideoDownloaded(bufferedPercent){
    this.loadingBarTarget.style.width = `${bufferedPercent}%`
  }
  
}