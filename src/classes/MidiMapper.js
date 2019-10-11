import { exists } from "fs";


const ON_CHANNELS = {
    "144": "1",
    "145": "2",
    "146": "3",
    "147": "4",
    "148": "5",
    "149": "6",
    "150": "7",
    "151": "8",
    "152": "9",
    "153": "10",
    "154": "11",
    "155": "12",
    "156": "13",
    "157": "14",
    "158": "15",
    "159": "16"
}

const OFF_CHANNELS = {
    '128': '1',
    '129': '2',
    '130': '3',
    '131': '4',
    '132': '5',
    '133': '6',
    '134': '7',
    '135': '8',
    '136': '9',
    '137': '10',
    '138': '11',
    '139': '12',
    '140': '13',
    '141': '14',
    '142': '15',
    '143': '16'
}

// wee need to sort the big mididata file into many channels then build our concat strings from there 

export default class MidiMapper {

    constructor(midi){

        this.allMidi = midi

    }

    getMidiChannel(event) {
        let number = event["data"][0]
        if (OFF_CHANNELS[number] != undefined) {
           return OFF_CHANNELS[number]
        } else if(ON_CHANNELS[number] != undefined) {
            return ON_CHANNELS[number]
        } else {
            throw new Error("channel data not defined for this event object")
        }
    }

    sortedEventsToChannels(events){

       let channels = {}
        
       events.forEach(event => {
            // key does not yet exist, create an array to hold subsequent objects   
            if(channels[this.getMidiChannel(event)] == undefined) {
                let arrayOfChannelEvents = []
                arrayOfChannelEvents.push(event)
                channels[this.getMidiChannel(event)] = arrayOfChannelEvents
            // key exists as array, add the event object to the existing group
            } else {
                channels[this.getMidiChannel(event)].push(event)    
            }
        });

        return channels

    }

    determineNoteOnOff(event){

        let onOffNumber = event["data"][0]

        if(ON_CHANNELS[onOffNumber] != undefined) {

            return true 

        } else if(OFF_CHANNELS[onOffNumber] != undefined) {
            
            return false 

        } else {
            
            throw new Error("Unrecognizable number for midi note on/off")
        }



    }

    bakeDataForParsing(recordedMidi){

        let channelsObject = this.sortedEventsToChannels(recordedMidi)

        //mark note true or false 
        Object.keys(channelsObject).forEach( keyname => {
            
            channelsObject[keyname] = channelsObject[keyname].map( event => {
                
                let newEvent = {
                    noteOn: null,
                    timeStamp: null,
                    noteNumber: null,
                    velocityNumber: null
                }

                if(this.determineNoteOnOff(event)) {
                    newEvent["noteOn"] = true 

                } else {
                    newEvent["noteOn"] = false 
                }

                newEvent.timeStamp = event.timeStamp

                newEvent.velocityNumber = event.data[2]

                newEvent.noteNumber = event.data[1]

                return newEvent


            })

        })

        //do sorting after everything else 
        Object.keys(channelsObject).forEach(keyname => {
           
            let sortedByChannel = channelsObject[keyname].sort((a,b)=> {
               return (a.timeStamp - b.timeStamp)
            }) 
            channelsObject[keyname] = sortedByChannel
        
        }) 
        return channelsObject


    }

    determineUsedNotes(data) {
        let channelsAndNotes = {}
        let midiNotes = this.bakeDataForParsing(data)

        Object.keys(midiNotes).forEach(keyName => {
            midiNotes[keyName].forEach(event => {
                let noteNumber = event["noteNumber"]

                if(channelsAndNotes[noteNumber] === undefined) {
                    channelsAndNotes[noteNumber] = []
                    channelsAndNotes[noteNumber].push(keyName)
                } else {
                    if(!channelsAndNotes[noteNumber].includes(keyName)) {
                        channelsAndNotes[noteNumber].push(keyName)
                    }
                }
            })

           
        })
        return channelsAndNotes
    }

    

    





}