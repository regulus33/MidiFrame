import { Controller } from "stimulus"

export default class extends Controller {

  static targets = [ "hide", "show" ]

  showLoader(){
    hideTarget.className = "hide"
    showTarget.className = "show"
  }

}