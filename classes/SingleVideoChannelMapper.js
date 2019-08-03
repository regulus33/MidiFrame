const execSync = require('child_process').execSync;
var path = require('path');
const fs = require('fs');

const ON_CHANNELS = {"144": "1","145": "2","146": "3","147": "4","148": "5","149": "6","150": "7","151": "8","152": "9","153": "10","154": "11","155": "12","156": "13","157": "14","158": "15","159": "16"}
const OFF_CHANNELS = {'128': '1','129': '2','130': '3','131': '4','132': '5','133': '6','134': '7','135': '8','136': '9','137': '10','138': '11','139': '12','140': '13','141': '14','142': '15','143': '16'}
const CHANNEL_TEMPLATE = {"1":[],"2":[],"3":[],"4":[],"5":[],"6":[],"7":[],"8":[],"9":[],"10":[],"11":[],"12":[],"13":[],"14":[],"15":[],"16":[]};
//this is a template that we'll plug our unsorted data into and extract channels/insert data into in an organizzzzed fash brash 
//https://video.stackexchange.com/questions/25291/how-to-precisely-trim-video-with-ffmpeg-ss-and-t-are-off-by-more-than-a-half
//in seconds, so 121 is two min and one second
channelStartPoints = {
    "1":121,
    "2":3.67,
    "3":6.78,    
}
channelVideos = {
    "1":"wood.mp4",
    "2":"test_b.mp4",
    "3":"test_b.mp4" 
}

module.exports = class SingleVideoChannelMidiMapper {
    
    constructor(channel, video, data) {
        this.video = video;
        this.channel = channel;
        this.sortedChannels = {"1":[],"2":[],"3":[],"4":[],"5":[],"6":[],"7":[],"8":[],"9":[],"10":[],"11":[],"12":[],"13":[],"14":[],"15":[],"16":[]};
        this.slicedVidsDirectoryPath = this._app_directory() + `/midi_slices/channel_${this.channel}`;
        //the method here just sets this.sortedChannels to the relevant data 
        this._processMidiDataForChannelSlicing(data);
    }

    //slices the channel's video into mp4s in an isolated direcoty where each video file is named the same as its timestamp and therefore sorted in order for concatenation later 
    sliceChannelVid() {
        
        for(let i=0; i < this.sortedChannels["1"].length; i++) {
            if(!this.sortedChannels["1"][i].noteOn) {
                    //if this is note off, great! Lets go get the note on that got us here in the first place, i -1 should do it!
                let startOfNote = this.sortedChannels["1"][i-1].time
                
                let endOfNote = this.sortedChannels["1"][i].time 
                //use this if you change the algorithm
                let clipLength =  endOfNote - startOfNote
                
                if(i != this.sortedChannels["1"].length -1 ) {
                    let timeTilNext = this.sortedChannels["1"][i+1].time - startOfNote                                       //was cliplength 
                    execSync(`ffmpeg -i ${this._app_directory()}` + `/assets/video_bank/${this.video}` + " -ss " + `${channelStartPoints["1"]} -t ${timeTilNext} -async 1 ${path.join(this._app_directory())}/midi_slices/channel_1/${startOfNote}.mp4`)
                }
            }
        }
    }

    //builds a simple file we need to feed to FMMPEG sorted from beginning to end of concat instructions 
    buildFFMPEGConcatFile(fileName) {

        let concatInstructionsString = ""
        let slicedVideoFiles = fs.readdirSync(this.slicedVidsDirectoryPath)
         
        slicedVideoFiles.forEach((file) => {
            
            console.log("slicedVideos: " + file); 
            //leave out the bullshit 
            if(file != ".DS_Store") {
                //each line looks like:
                // file 'path/to/file.mp4'
                concatInstructionsString += "file" + " '" + path.join(this._app_directory() + "/midi_slices/channel_1/") + file + "'" + "\n"
            }   

        });
        let pathFile = path.join(this._app_directory() + `/${fileName}.txt`)
        //ok, file is ready to be picked up by the next step 
        fs.writeFileSync(pathFile, concatInstructionsString );
        return pathFile;
    }


    executeConcat(pathFile) {
        execSync(`ffmpeg -f concat -safe 0 -i ${pathFile} -c copy outputs/video_${Date.now()}.mp4`)
    }

    _app_directory() {
        let absolutePath = path.join(__dirname).split("/");
        absolutePath.pop();
        return absolutePath.join("/");
    }

    _processMidiDataForChannelSlicing(data) {
        console.log("processing data: " + data); 
        data.forEach((event) => {
    
            if(OFF_CHANNELS[event.noteChannel.toString()] != undefined) {
                //push value into array of this channel //gets the actuall channel number to string 
                this.sortedChannels[OFF_CHANNELS[event.noteChannel.toString()]].push({noteOn: false, time: this._millisToSeconds(event.timeStamp)})
            } else {
                this.sortedChannels[ON_CHANNELS[event.noteChannel.toString()]].push({noteOn: true, time: this._millisToSeconds(event.timeStamp)})
            }

        })
    }

    _millisToSeconds(millis){
        return millis/1000
    }


}



