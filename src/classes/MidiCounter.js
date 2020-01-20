
const CLOCK_SIGNALS_IN_1_BAR = 96
const BEATS_IN_1_BAR = 4 

export default class MidiCounter {

    constructor(){

    }
//  How many clock signals do we need to let pass before we unhook our event listeners? 
    static getLength(barCount) {
        return CLOCK_SIGNALS_IN_1_BAR * barCount
    }

    static getLengthInSecondsOfClip(barCount, BPM){
        const secondsPerBeat = 60 / BPM 
        const totalBeats = barCount * BEATS_IN_1_BAR 
        const seconds_That_Pass_In_This_Clip = secondsPerBeat * totalBeats
        return seconds_That_Pass_In_This_Clip
    }

}