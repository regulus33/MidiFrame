import { Controller } from "stimulus"
export default class extends Controller {

  static targets = ["splashImage", "splashText"]

  connect(){
    this.positionSplashText = this.positionSplashText.bind(this);
    window.onresize = this.positionSplashText;
    window.onscroll = this.positionSplashText;
  }

  positionSplashText(){
    let heightOffset = this.splashImageTarget.height;
    this.splashTextTarget.style.top = `${heightOffset + 75}px`
    this.splashTextTarget.style.visibility = `visible`
  }


}