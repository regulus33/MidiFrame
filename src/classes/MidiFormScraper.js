export default class MidiFormScraper {
    constructor() {

        if (!!MidiFormScraper.instance) {
            return MidiFormScraper.instance;
        }

        MidiFormScraper.instance = this;

        this.midiData = {
            "0":[],
            "1":[],
            "2":[],
            "3":[],
            "4":[],
            "5":[],
            "6":[],
            "7":[],
            "8":[],
            "9":[],
            "10":[]
        }

        return this;
    }

    commitState(stateSnapshot){
    }

    
    
}

