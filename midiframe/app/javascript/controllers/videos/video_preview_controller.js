import { Controller } from "stimulus"
import { newProjectFromVideo } from "../../helpers/network"
export default class extends Controller {

  static targets = ["preview"]

  connect(){
    this.createProjectFromVideo = this.createProjectFromVideo.bind(this);
  }

  addVideoToProject(e) {
    // newProjectFromVideoUrl()
  }

  createProjectFromVideo(e) {
    let element;
    if(e.target.childElementCount){
      element = e.target;
    } else {
      element = e.target.parentElement;
    }
    newProjectFromVideo({
      videoId: element.getAttribute("data-video-id"), 
      authenticityToken: this.element.getAttribute("data-auth-token")
    }).then((e)=>{
      e.json().then((r)=>{
        // redirect to patterns create time 
        window.location.href = r.nextUrl 
      })
    })
  }
}