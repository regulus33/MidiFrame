const path = require('path');

export default class MidiToVideo {


    constructor(channel,notes,clip, data){
        this.channel = channel
        this.notes = notes
        this.clip = clip
        this.processedDataObject = data[this.channel]
        this.app_root = this.createAppRootString()
        //keep interpolation strings in one place for easey access 
        this.removeStrayVideoString = `rm -rf ${this.app_root}/midi_slices/channel_${this.channel}/./*`
    }

        //slices the channel's video into mp4s in an isolated direcoty where each video file is named the same as its timestamp and therefore sorted in order for concatenation later 
    sliceChannelVid() {

            this.removeOldVideoSlices
            
            for(let i=0; i < this.processedDataObject[this.channel].length; i++) {
                if(!this.sortedChannels[this.channel][i].noteOn) {
                        //if this is note off, great! Lets go get the note on that got us here in the first place, i -1 should do it!
                    let startOfNote = this.sortedChannels[this.sortedChannels][i-1].time
                    
                    let endOfNote = this.sortedChannels["1"][i].time 
                    //use this if you change the algorithm
                    let clipLength =  endOfNote - startOfNote
                    
                    if(i != this.sortedChannels["1"].length -1 ) {
                        let timeTilNext = this.sortedChannels["1"][i+1].time - startOfNote                                       //was cliplength 
                        execSync(`ffmpeg -i ${this._app_directory()}` + `/assets/video_bank/${this.video}` + " -ss " + `${channelStartPoints["1"]} -t ${timeTilNext} -async 1 -y ${path.join(this._app_directory())}/midi_slices/channel_1/${startOfNote}.mp4`)
                    }
                }
            }
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