import { Controller } from "stimulus"

export default class extends Controller {

  static targets = ["filename", "fontFileName", "fileDisplayName", "fontFileDisplayName"]
  // ? Video
  printFileName() {
    this.fileDisplayNameTarget.innerText = this.filenameTarget.value.split("\\")[this.filenameTarget.value.split("\\").length - 1]
  }
  // ? Font
  printFontFileName() {
    this.fontFileDisplayNameTarget.innerText = this.fontFileNameTarget.value.split("\\")[this.fontFileNameTarget.value.split("\\").length - 1]
  }
}