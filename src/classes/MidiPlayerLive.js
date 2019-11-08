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
export default class MidiPlayerLive {

    constructor() {
        this.something = ''
    }

    playVideoAtSecondsStart(secondsInteger){
        let vid = document.getElementsByTagName("video")[0]
        vid.currentTime = secondsInteger
        vid.play()
    }

    convertMinutesToSeconds(stringOfMinutes){
        let minutes = stringOfMinutes.split(":")[0]
        let seconds = stringOfMinutes.split(":")[1]
        return Number(minutes) * 60 + Number(seconds)
    }

    playNote(midiEvent,selectedChannel,notes){
        let timeStampString = notes[midiEvent["data"][1]]
        if(ON_CHANNELS[selectedChannel] === midiEvent["data"][0] && timeStampString ){
            this.playVideoAtSecondsStart(
                this.convertMinutesToSeconds(timeStampString)
            )
        }
    }







    


}