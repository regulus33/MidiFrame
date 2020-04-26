import { Controller } from "stimulus"
import WebMidi from 'webmidi'

export default class extends Controller {

  static targets = ["videoPreview"]

  connect() {
    this._enable_midi()
  }

  onMessageStart() {
    this._play()
  }

  get _midiInput(){
    return WebMidi.inputs[0]
  }

  _on_success(){
    this._midiInput.addListener('start', "all", this.onMessageStart.bind(this))
  }

  _on_error(error) {
    // console.log(error)
    alert('Could not connect to device ☹️')
  }

  _enable_midi(channel) {
    WebMidi.enable(error => { error ? this._on_error(error) : this._on_success(channel)  })
  }

  _play() {
    this.videoPreviewTarget.play()
  }
}
