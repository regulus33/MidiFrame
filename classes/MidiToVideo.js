const path = require('path');
const execSync = require('child_process').execSync;
const fs = require('fs');

module.exports = class MidiToVideo {

    constructor(channel,notes,clip, data){
        console.log(`MidiToVideoConstructor channel: ${channel}, notes: ${notes}, clip: ${clip}, data: ${data}`)
        this.channel = channel
        this.notes = notes
        this.clip = clip
        this.processedDataArray = data[this.channel]
        this.app_root = this.createAppRootString()
        //keep interpolation strings in one place for easey access 
        this.removeStrayVideoString = `rm -rf ${this.app_root}/midi_slices/channel_${this.channel}/./*`
    }

    createClip() {
        let pathToInputTextFile = `${this.app_root}//midi_slices/input_${this.channel}.txt`
        let command = `ffmpeg -an -f concat -safe 0 -i ${pathToInputTextFile} -c copy output_${this.channel}_at_${Date.now()}.mp4`
        execSync(command)
    }

        //slices the channel's video into mp4s in an isolated direcoty where each video file is named the same as its timestamp and therefore sorted in order for concatenation later 
    generateChannelSliceCommands() {
        //just run an rm -rf in the directory where thiss channel stores video slices
        this.removeOldVideoSlices()
        //iterate through the reorded midi events
        return this.processedDataArray.map(event => {
            //need to know so we dont get index out of bounds for next
            let weAreAtTheEndOfArray = (this.processedDataArray.indexOf(event)) === (this.processedDataArray.length - 1)
            //we need to look ahead to determin the length of this clip, the length is the distance of time between pressing this key and the next. 
            let nextEvent = !weAreAtTheEndOfArray ? (this.processedDataArray[this.processedDataArray.indexOf(event) + 1]) : null 
            //start of clip 
            let startOfClip = event.timeStamp 

            let endOfClip
            //cop out out to avoid index out of bounds 
            if(weAreAtTheEndOfArray) {
                //ZACK this doesnt make sense does it? If we are at the last note in the data array, the length of it should be calculated by subtracting the time from hitting the stop button back to the last midi note trigger. Look for a sys ex message stop, you already look for this in MidiRecorderContainer through BrowserMidiCollector
                endOfClip = startOfClip + 1
            } else {
                //we arent there yet  
                endOfClip = nextEvent.timeStamp
            }
            //nothing out of the ordinary here 
            let clipLength = this.convertMillisecondsToSeconds(endOfClip - startOfClip)  
            //generate SLICE
            let sliceStart = this.convertTimeStampToSecondsInteger(
                this.getBeginningOfSlice(event)
            )

            return `ffmpeg -an -y -ss ${sliceStart} -i ${this.clip} -t ${clipLength} -c:v libx264 ${path.join(this.app_root)}/midi_slices/channel_${this.channel}/${event.timeStamp}.mp4`

        })

    }

    convertMillisecondsToSeconds(num){
        return num * 0.001 
    }

    //create the file for arguments supplied to ffmpeg 
    createInput(){
        let fileName = `${this.app_root}/midi_slices/input_${this.channel}.txt`
        let commands = ""
        this.generateFfmpegConcatArgsForSelf().forEach(str =>{
            commands += str
        })
        fs.writeFileSync(fileName, commands, error => {
            err ?  console.log("[CREATEINPUT] input failed to write") :  console.log("[CREATEINPUT] input for ffmpeg successfully written")
        })

    }
    
    generateFfmpegConcatArgsForSelf() {
        let dirName = `${this.app_root}/midi_slices/channel_${this.channel}`
        let slicesDirectoryFiles = fs.readdirSync(dirName)
        return slicesDirectoryFiles.map(fileName => {
            //only add actual files to the array 
            if(fileName != ".DS_Store") {
                return "file" + " '" +`${dirName}/${fileName}`+ "'" + "\n"
            }
        }).filter(d=>d!=undefined)
    }

    convertTimeStampToSecondsInteger(stamp) {
        let firstNumber = stamp.split(":").shift()
        let secondNumber = stamp.split(":").pop()
        return Number(firstNumber) * 60 + Number(secondNumber)
    }

    getBeginningOfSlice(event) {
       return this.notes[event.noteNumber]
    }

    //TODO: all the below are untested and or undocumented 
    makeClips() {
        this.generateChannelSliceCommands().forEach( command => {
            console.log(`we are in makeClips in generateChannelSliceCommands().forEach and we are sync executing this command: ${command}`)
            execSync(command)
        })
    }
    
    //need this for FS stuff. 
    createAppRootString() {
        let absolutePath = path.join(__dirname).split("/");
        absolutePath.pop();
        return absolutePath.join("/");
    }
    
    //cleaning, keep it light 
    removeOldVideoSlices(){
        execSync(this.removeStrayVideoString)
    }

}

