
const addListenerOne = (name, channel, callBack) => {
    input[name] = callBack
}
const input = {
    noteon: null,
    noteon: null,
    clock: null,
    start: null,
    stop: null,
    addListener: (name, channel, callBack) => {
        addListenerOne(name, channel, callBack)
    }

}

const output = {
    sendStop: () => null,
}

export default class WebMidi {

    output = {
        sendStop: () => null,
    }
    // WebMidi.enable(error => { error ? this._on_error(error) : this._on_success(this.getSavedChannel()) })
    static enable(onBrowserResponse) {
        let error = false
        onBrowserResponse(error);
    }

    static inputs = [
        input
    ]

    static output = [
        output
    ]
    // this._midiInput.addListener('noteon', channel, msg => this.onMessageNoteOn(msg))

}
