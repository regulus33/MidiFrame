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

    


}