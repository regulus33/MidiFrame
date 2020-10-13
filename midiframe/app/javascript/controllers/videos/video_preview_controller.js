import { Controller } from "stimulus"
export default class extends Controller {

  static targets = ["preview"]

  connect(){
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.modal');
      var instances = M.Modal.init(elems, options);
    });
  }

  addVideoToProject(e) {
    // let videoId = e.target.getAttribute("data-video-id");
    // fetch('projects/');
    // if we havent selected a note, dont show modal
    const d = document.querySelectorAll('.modal');
    const instances = M.Modal.init(d, { title: "moon" });
    // this.inputValueTarget.value = this.pianoTextData[currentKey] ? this.pianoTextData[currentKey] : ""
    // this.textModalTitleTarget.innerHTML = "title"
    instances[0].open();
  }
}