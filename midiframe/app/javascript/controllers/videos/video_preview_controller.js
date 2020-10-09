import {Controller} from "stimulus";


export default class extends Controller {

  connect(){
    console.log("connected");
  }

  onhoverPreview(e){
    // e.target.outer
    debugger 
    let video_url = e.target.parentElement.getAttribute("data-video-url");
    e.target.outerHTML = `<video style="width:100%;height:auto" src="${video_url}"/>`
  }


}