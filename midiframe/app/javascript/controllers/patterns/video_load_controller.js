import { Controller } from "stimulus"
import { waitForVideoToLoad } from "custom/video_loader"
export default class extends Controller {

  static targets = ["video"]

  connect(){

   waitForVideoToLoad(this.element.id, this.onVideoDownloaded) 

  }

  onVideoDownloaded(){
    alert('video dl')
  }
  
}