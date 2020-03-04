import { Controller } from "stimulus"

export default class extends Controller {

  static targets = [ "show", "hide" ]

  showLoader(){
      this.showTarget.className = "show" 
      this.hideTarget.className = "hide"
  }
}