import { Controller } from "stimulus"
export default class extends Controller {

  static targets = [
    "overlay",
    "loader",
    "splashImage",
    "splashText",
    "splashVideo",
    "clownVideo",
    "playButton"
  ]

  connect() {
    let videoUrl = "/splash_video.mp4";
    let imageUrl = "/splash.png";
    let clownUrl = "/clown.mp4";
    this.positionSplashText = this.positionSplashText.bind(this);
    window.onresize = this.positionSplashText;
    window.onscroll = this.positionSplashText;
    window.onload = this.splashImageTarget.setAttribute('src', imageUrl);
    window.onload = this.splashVideoTarget.setAttribute('src', videoUrl);
    window.onload = this.clownVideoTarget.setAttribute('src', clownUrl);
    document.addEventListener('readystatechange', this.test.bind(this));
  }

  playVideo() {
    this.playButtonTarget.style.visibility = "hidden";
    this.clownVideoTarget.play();
    this.videoPlaying = true;
  }

  positionSplashText() {
    let heightOffset = this.splashImageTarget.height;
    let offsetWidth = this.splashImageTarget.width;
    this.splashTextTarget.style.top = `${heightOffset + 75}px`;
    this.splashTextTarget.style.visibility = `visible`;
    this.clownVideoTarget.style.top = `${heightOffset - heightOffset / 2.9}px`;
    this.clownVideoTarget.style.left = `${offsetWidth / 7.5}px`;
    this.playButtonTarget.style.top = `${heightOffset - heightOffset / 2}px`;
    this.playButtonTarget.style.right = `${offsetWidth / 2.58}px`;
  }

  loadedImage() {
    alert('loaded image');
  }

  test() {
    var state = document.readyState
    if (state == 'complete') {
      this.loaderTarget.style.display = 'none';
      this.overlayTarget.style.display = 'none';
    }
  }

}