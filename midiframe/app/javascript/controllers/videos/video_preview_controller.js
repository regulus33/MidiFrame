import { Controller } from "stimulus"
export default class extends Controller {

  static targets = ["preview"]

  addVideoToProject(e) {
    let videoId = e.target.getAttribute("data-video-id");
    fetch('projects/');
  }
}