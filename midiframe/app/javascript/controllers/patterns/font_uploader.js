import { Controller } from "stimulus";
import { savePattern } from "../../helpers/network.js"

export default class extends Controller {

  static targets = [
  ];

  connect() {
  }

  uploadFont(){
    console.log("uploadfont")
  }

}


