const ON_CHANNELS = {
    "1":"144",
    "2":"145",
    "3":"146",
    "4":"147",
    "5":"148",
    "6":"149",
    "7":"150",
    "8":"151",
    "9":"152",
    "10":"153", 
    "11":"154", 
    "12":"155", 
    "13":"156", 
    "14":"157", 
    "15":"158", 
    "16":"159", 
  }
//TODO: make me a singleton or a util like thing
export default class MidiPlayerLive {

    constructor() {
    }

    static playVideoAtSecondsStart(secondsInteger) {
        console.log(secondsInteger)
        let vid = document.getElementsByTagName("video")[0]
        vid.currentTime = secondsInteger
        // vid.play()
    }

    static convertMinutesToSeconds(stringOfMinutes) {
        let minutes = stringOfMinutes.split(":")[0]
        let seconds = stringOfMinutes.split(":")[1]
        return Number(minutes) * 60 + Number(seconds)
    }

    static sanitize(input){
        if (input == undefined) {
            return ""
        }
        let leftSide =  input.split(":").shift()
        let rightSide = input.split(":").pop()
        if(rightSide == "" || leftSide == "" || (input.split(":").length == 1)) {
            return ""   
        } else {
            return input 
        }
    }

    static randomTimeWithinThisSpan(max) {
        let int = Math.floor(Math.random() * Math.floor(max))
        let arrayOfMinutesAndThenSeconds = this.getArrayOfMinutesThensseconds(int)
        let seconds = 60 * Number("0." + arrayOfMinutesAndThenSeconds.pop()) 
        if(arrayOfMinutesAndThenSeconds[0]== undefined){
            debugger
        }
        return arrayOfMinutesAndThenSeconds.shift() + ":" + String(seconds).split(".").shift()
    }

    static getArrayOfMinutesThensseconds(int) {
        const arr = String(int/60).split(".")
        if(arr.length == 1) {
            arr.push("00")
            return arr 
        }
        return arr 
    }

    static playNote(channel, note, selectedChannel,notes) {
       
        let timeStampString = this.sanitize(notes[note])
        if(ON_CHANNELS[selectedChannel] == channel && timeStampString ){
            this.playVideoAtSecondsStart(
                this.convertMinutesToSeconds(timeStampString)
            )
        }
    }


}

// if(ON_CHANNELS[selectedChannel] === midiEvent["data"][0] && timeStampString ){