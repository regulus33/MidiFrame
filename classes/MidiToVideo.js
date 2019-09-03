const path = require('path');
const execSync = require('child_process').execSync;
const fs = require('fs');

export default class MidiToVideo {

    constructor(channel,notes,clip, data){
        this.channel = channel
        this.notes = notes
        this.clip = clip
        this.processedDataArray = data[this.channel]
        this.app_root = this.createAppRootString()
        //keep interpolation strings in one place for easey access 
        this.removeStrayVideoString = `rm -rf ${this.app_root}/midi_slices/channel_${this.channel}/./*`
    }

        //slices the channel's video into mp4s in an isolated direcoty where each video file is named the same as its timestamp and therefore sorted in order for concatenation later 
        generateChannelSliceCommands() {

            this.removeOldVideoSlices()
            console.log(this.processedDataArray)
            
           return this.processedDataArray.map(event => {
                //need to know so we dont get index out of bounds for next
                let weAreAtTheEndOfArray = (this.processedDataArray.indexOf(event)) === (this.processedDataArray.length - 1)
                
                let nextEvent = !weAreAtTheEndOfArray ? (this.processedDataArray[this.processedDataArray.indexOf(event) + 1]) : null 
                
                let startOfClip = event.timeStamp 

                let endOfClip
                //cop out out to avoid index out of bounds 
                if(weAreAtTheEndOfArray) {
                  endOfClip = startOfClip + 1
                //we arent there yet  
                } else {
                    endOfClip = nextEvent.timeStamp

                }
                
                let clipLength = endOfClip - startOfClip 
                let sliceStart = this.convertTimeStampToSecondsInteger(
                    this.getBeginningOfSlice(event)
                )

                return `ffmpeg -i ${this.app_root}/assets/video_bank/${this.clip} -ss ${sliceStart} -t ${clipLength} -async 1 -y ${path.join(this.app_root)}/midi_slices/channel_${this.channel}/${event.timeStamp}.mp4`


            })
    }


    convertTimeStampToSecondsInteger(stamp){
        let firstNumber = stamp.split(":").shift()
        let secondNumber = stamp.split(":").pop()
        return Number(firstNumber) * 60 + Number(secondNumber)
    }

    getBeginningOfSlice(event) {
       return this.notes[event.noteNumber]
    }

    //TODO: all the below are untested and or undocumented 
    
    makeClips(){
        this.generateChannelSliceCommands().forEach( command => {
            execSync(command)
        })
    }
    
    createAppRootString() {
        let absolutePath = path.join(__dirname).split("/");
        absolutePath.pop();
        return absolutePath.join("/");
    }
    
    removeOldVideoSlices(){
        execSync(this.removeStrayVideoString)
    }



    


}