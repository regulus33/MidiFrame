import { Controller } from "stimulus"
import { newProjectFromVideo } from "../../helpers/network"
export default class extends Controller {

  static targets = ["preview"]

  connect(){
    this.createProjectFromVideo = this.createProjectFromVideo.bind(this);
  }

  updateProjectWithVideo(e) {
    let element;
    if(e.target.childElementCount){
      element = e.target;
    } else {
      element = e.target.parentElement;
    }
    newProjectFromVideo({
      videoId: element.getAttribute("data-video-id"), 
      projectId: this.element[""]
    }).then((e)=>{
      e.json().then((r)=>{
        // redirect to patterns create time 
        window.location.href = r.nextUrl 
      })
    })
  }


  createProjectFromVideo(e) {
    let element;
    if(e.target.childElementCount){
      element = e.target;
    } else {
      element = e.target.parentElement;
    }
    debugger
    newProjectFromVideo({
      videoId: element.getAttribute("data-video-id"), 
    }).then((e)=>{
      debugger
      e.json().then((r)=>{
        debugger
        // redirect to patterns create time 
        window.location.href = r.nextUrl 
      })
    })
  }
}