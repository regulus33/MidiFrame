import { Controller } from "stimulus"

export default class extends Controller {

  static targets = [ "filename", "fileDisplayName" ]

  printFileName() {
    this.fileDisplayNameTarget.innerText = this.filenameTarget.value.split("\\")[this.filenameTarget.value.split("\\").length - 1]
  }
}