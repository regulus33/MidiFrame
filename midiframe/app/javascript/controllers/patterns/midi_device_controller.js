import { Controller } from "stimulus"
import MidiDevice from '../../models/midi_device'
export default class extends Controller {

  static targets = []

  connect() {
    const d = new MidiDevice()
  }
 
}