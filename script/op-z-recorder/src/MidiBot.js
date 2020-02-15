    //////////////////////
    // GLOBAL VARIABLES//
    ////////////////////



    const CLOCK_SIGNALS_IN_1_BAR = 96
    const BEATS_IN_1_BAR = 4 
    let deviceId = 0
    let clockCount = 0 
    let clockSignalsBeforeDone = 0
    let selectedProject = 0 
    let recording = false 
    let midiAccess = {}
    let tracksToRecord = []

    const PROJECTS_TO_CODES = {
        10: 185,
        9: 184,
        8: 183,
        7: 182,
        6: 181,
        5: 180,
        4: 179,
        3: 178,
        2: 177,
        1: 176
    }

    const DELAY = 1000 

    const MUTE_COMMANDS = {
        TAPE: [186, 53, 1],
        EFFECT_2: [185, 53, 1],
        EFFECT_1: [184, 53, 1],
        CHORD: [183, 53, 1],
        ARP: [182, 53, 1],
        LEAD: [181, 53, 1],
        BASS: [180, 53, 1],
        SAMPLE: [179, 53, 1],
        HAT: [178, 53, 1],
        SNARE: [177, 53, 1],
        KICK: [176, 53, 1]
    }

    const setup = () => {
      
        const patternCountSlider = document.getElementById("patternCountRange");
        const patternCountSliderOutput = document.getElementById("patternCount");
        const progressBar = document.getElementById("progress")

        const bot = new MidiBot({
            progressBar: progressBar,
            patternCountSlider: patternCountSlider,
            patternCountSliderOutput: patternCountSliderOutput
        })
        return bot 
        
    }
 
    class MidiBot {

        constructor(options){
            this.patternCountSlider = options.patternCountSlider
            this.patternCountSliderOutput = options.patternCountSliderOutput
            this.midiAccess = options.midiAccess 
            this.progressBar = options.progressBar
            this.recording = false
            this.currentTrackToRecord = "ARP"
            this.clockCount = 0 
            this.clockSignalsBeforeDone = 0 
            

        }

        calcClockSignalsBeforeDone = (barCount) => {
             const sigs = CLOCK_SIGNALS_IN_1_BAR * barCount
             this.clockSignalsBeforeDone = sigs 
             return sigs 
        }

        sendMessage = (message) => { 
            const output = this.midiAccess.outputs.get(deviceId)
            output.send(message)
        }

         //tested
        record = () => {
            this.recording = true
        }

        //tested
        play = () => {
            this.sendMessage([250])
        }

         //tested
        stop = () => {
            this.sendMessage([252])
        }

        initializeUI = () => {
            this.patternCountSliderOutput.innerHTML = this.patternCountSlider.value
            this.progressBar.max = this.calcClockSignalsBeforeDone(this.patternCountSlider.value)
            
            this.patternCountSlider.oninput = this.onPatternCountSliderInput
            this.projectSlider.oninput = this.onProjectSliderInput 
            return this 
        }

        //HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS
        //HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS
        //HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS
        //HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS
        //HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS
        //HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS HANDLERS

        onPatternCountSliderInput = () => {
            const totalBars = this.patternCountSlider.value
            this.patternCountSliderOutput.innerHTML = totalBars
            this.clockSignalsBeforeDone = calcClockSignalsBeforeDone(totalBars)
            this.progressBar.max = this.clockSignalsBeforeDone
        }

        //tested
        onMidiMessage = (message) => {

            if(this.recording && message.data[0] == 248) {
                
                Object.keys(MUTE_COMMANDS).forEach((trackName) => {
                    if( trackName != this.currentTrackToRecord ) {
                        this.sendMessage(MUTE_COMMANDS[trackName])
                    }
                })
                //for advanced cycling 
                // if(this.clockCount > 0 && this.clockCount == this.clockSignalsBeforeDone){
                    
                    // if(tracksToRecord.length === 0) {
                    //     alert('recording is done')
                    //     sendMessage([252])
                    // } else {
                    //     cycleMidi()
                    // }
                // } else {
                    this.clockCount += 1 
                    this.progressBar.value = this.clockCount
                // }
            } 
      
        }


        //slider is changed, the bar count is updated and so is the clock signals before done count 
        // hit play and recoring begins... 
        //mute messages are sent on every clock count that are not the selected track. Lets start with the arp track. 
        //




    }
 
    // const patternCountSlider = document.getElementById("patternCountRange");
    // const patternCountSliderOutput = document.getElementById("patternCount");
    // const progressBar = document.getElementById("progress")
    // patternCountSliderOutput.innerHTML = patternCountSlider.value;
    // progressBar.max = calcClockSignalsBeforeDone(patternCountSlider.value)

    // patternCountSlider.oninput = () => {
    //     const totalBars = patternCountSlider.value
    //     patternCountSliderOutput.innerHTML = totalBars
    //     clockSignalsBeforeDone = calcClockSignalsBeforeDone(totalBars)
    //     progressBar.max = clockSignalsBeforeDone
    // }

    // /////////project sliders 
    // const projectSlotSlider = document.getElementById("projectSlotRange");
    // const projectSlotSliderOutput = document.getElementById("projectSlot");
    // projectSlotSliderOutput.innerHTML = projectSlotSlider.value;
    // selectedProject = projectSlotSlider.value 

    // projectSlotSlider.oninput = () => {
    //     const projectSlotValue = projectSlotSlider.value
    //     projectSlotSliderOutput.innerHTML = projectSlotValue
    //     selectedProject = projectSlotValue
    // }


    // const midiConsent = (event) => {
    //     console.log('requesting to midi access')
    //     request()
    // } 

    // async function cycleMidi() {
    //     //fill the array if it isnt full yet, first time 
    //     if(tracksToRecord.length === 0) {
    //        assignRecordTracks()
    //     }

    // //     let currentTrackToRecord = tracksToRecord.pop() 
    // //    //iterate through every patthern an mute all but selected
    // //    for(let i = 0; i < 15; i++) {
    // //         //go through each pattern and mute tracks
    // //         await sleep(DELAY) 
    // //         sendMessage([PROJECTS_TO_CODES[selectedProject],103,i])
    // //         //mute all but current 
    // //         Object.keys(MUTE_COMMANDS).forEach((trackName) => {
    // //             if( trackName != currentTrackToRecord ) {
    // //                 // sendMuteMessages(trackName)
    // //             }
    // //         })

    // //    } 
    //     //all  mutes have been applied, start at pattern 0 
    //     let currentTrackToRecord = tracksToRecord[0]
    //     Object.keys(MUTE_COMMANDS).forEach((trackName) => {
    //         if( trackName != currentTrackToRecord ) {
    //             sendMuteMessages(trackName)
    //         }
    //     })
    //     recording = true 
    //     sendMessage([250])
        
    // }

    // async function sendMuteMessages(trackName){
    //     let muteMessage = MUTE_COMMANDS[trackName]
    //     console.log("sending: " + muteMessage )
    //     await sleep(DELAY)
    //     sendMessage(muteMessage)
    // }

    // const assignRecordTracks = () => {
    //     const tracks = document.getElementsByClassName("tracks")

    //     for(let i = 0; i < tracks.length; i++) {
    //         let element = tracks[i]
    //         if(element.checked) {
    //             tracksToRecord.push(element.value)
    //         } 
    //     }
      
    //     // these and then store them somewhere than iterate through that 
    //     // once user hits start 
    //     // then record mono and if you can do 2 channels record each chanel of each track 
    // }


    // const request = () => {
    //     return navigator.requestMIDIAccess( {sysex: true }).then( access => {
    //         midiAccess = access
    //         const inputPorts = access.inputs.values();
    //         const outputPorts = access.outputs.values();
    //         for (let out of outputPorts) {
    //             deviceId = out.id 
    //         }
    //         for (let device of inputPorts ) {
    //             if (device.name == "OP-Z") {
    //                 console.log(device.name + " connected")
    //                 device.onmidimessage = onMidiMessage 
    //                 // sendMessage("nothing")
    //             } else {
    //                 alert("Can't find an OP-Z :( Make Sure Your OP-Z is plugged into to the usb port on your device.")
    //             }
    //         }
    //     }).catch(console.error);
    // }

    // const onMidiMessage = (message) => {
    //     //IF THIS IS THE CLOCK SIGNAL AND WE ARE IN RECORDING MODE 
    //     if(recording && message.data[0] == 248) {
    //         debugger 
    //         let currentTrackToRecord = tracksToRecord[0]
    //         Object.keys(MUTE_COMMANDS).forEach((trackName) => {
    //             if( trackName != currentTrackToRecord ) {
    //                 debugger 
    //                 sendMuteMessages(trackName)
    //             }
    //         })
    //         //IF WE HAVE REACHED THE END OF THE PROJECT
    //         if(clockCount > 0 && clockCount == clockSignalsBeforeDone){
    //             //stop op-z 
    //             alert('length finished')
    //             //if there are stil tracks to record we will recall cycleMidi()
    //             if(tracksToRecord.length === 0) {
    //                 alert('recording is done')
    //                 sendMessage([252])
    //             } else {
    //                 cycleMidi()
    //             }
    //         } else {
    //             clockCount += 1 
    //             progressBar.value = clockCount
    //         }
    //     } 
      
    // }

    // const sendMessage = (message) => { 
    //     const output = midiAccess.outputs.get(deviceId)
    //     output.send(message)
    // }

    // const sleep = (ms) => {
    //     return new Promise(resolve => setTimeout(resolve, ms))
    // }

    // document.getElementById('midiConsent').onclick = midiConsent 
    // // document.getElementById('start').onclick = test
    // document.getElementById('start').onclick = cycleMidi 


