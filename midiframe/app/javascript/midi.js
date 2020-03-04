
export const requestMidiAccessFromChrome = () => {
  navigator.requestMIDIAccess({sysex: true}).then( access => {

    const devices = access.inputs.values();
    for (let device of devices ) {

        device.onmidimessage = (message) => { message.data[0] != 248 ? console.log(message.data) : "dump" } 
    }
  }).then((response)=>{
    alert('this happens later')
  })
}



