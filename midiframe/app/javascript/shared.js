const FILENAME = "shared.js"

export const requestMidiAccessFromChrome = ({onReceiveMidiMessage, onReceiveAccessFromChrome, onRejectedAccessFromChrome}) => {
  navigator.requestMIDIAccess({sysex: true }).then( access => {

    const devices = access.inputs.values();
    for (let device of devices ) {
        // l(device + " is connected", FILENAME);
        device.onmidimessage = onReceiveMidiMessage 
        onReceiveAccessFromChrome();
    }
  }).catch();
}

export const onMidiMessageJamming = (message) => {
  console.log(message.data);
}

export const onRejectedAccessFromChrome = () => {
  alert('No midi devices detected. Is your device plugged in and turned on? 🔌')
}

export const showLoaderWhenSubmitForm = (formElement) => {
  //find the main content of the page and hide it, then display the loading bar which is always hidden in the main app
  formElement.addEventListener("submit", (event) => {
      formElement.style = {"display":"none"}
      document.getElementById("page_content").className = "hidden"
      document.getElementById("loading_bar").className = "visible"
  });
}







