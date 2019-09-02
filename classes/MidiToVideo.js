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
            this.processedDataArray.map(event => {
                let lastIndex = (this.processedDataArray.indexOf(event)) === (this.processedDataArray.length - 1)
                let nextIndex = lastIndex ? this.processedDataArray.indexOf(event) + 1 : null 
                let startOfClip = event.timeStamp 
                //cop out out to avoid index out of bounds 
                let endOfClip = !lastIndex ? nextIndex.timeStamp : (startOfClip + 1)
                
                let clipLength = endOfClip - startOfClip 

                let sliceStart = this.convertTimeStampToSecondsInteger(
                    this.getBeginningOfSlice(event)
                )

                `ffmpeg -i ${this.app_root}/assets/video_bank/${this.video} -ss ${sliceStart} -t ${timeTilNext} -async 1 -y ${path.join(this._app_directory())}/midi_slices/channel_1/${startOfNote}.mp4`


            })

            // for(let i=0; i < this.processedDataArray[this.channel].length; i++) {
            //     if(!this.sortedChannels[this.channel][i].noteOn) {
            //             //if this is note off, great! Lets go get the note on that got us here in the first place, i -1 should do it!
            //         let startOfNote = this.sortedChannels[this.sortedChannels][i-1].time
            //         let endOfNote = this.sortedChannels["1"][i].time 
                    
            //         // let clipLength =  endOfNote - startOfNote
                    
            //         if(i != this.sortedChannels[this.channel].length -1 ) {
            //             let timeTilNext = this.sortedChannels["1"][i+1].time - startOfNote                                       //was cliplength 
            //             execSync(`ffmpeg -i ${this._app_directory()}` + `/assets/video_bank/${this.video}` + " -ss " + `${channelStartPoints["1"]} -t ${timeTilNext} -async 1 -y ${path.join(this._app_directory())}/midi_slices/channel_1/${startOfNote}.mp4`)
            //         }
            //     }
            // }
    }

    convertTimeStampToSecondsInteger(stamp){
        let firstNumber = stamp.split(":").shift()
        let secondNumber = stamp.split(":").pop()
        return Number(firstNumber) * 60 + Number(secondNumber)
    }

    getBeginningOfSlice(event) {
       return this.notes[event.noteNumber]
    }

    //TODO: all the below are untested 
    createAppRootString() {
        let absolutePath = path.join(__dirname).split("/");
        absolutePath.pop();
        return absolutePath.join("/");
    }
    
    removeOldVideoSlices(){
        execSync(this.removeStrayVideoString)
    }



    


}