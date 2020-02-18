const path = require('path');
const execSync = require('child_process').execSync;
const fs = require('fs');

module.exports = class MidiToVideo {

    constructor(channel,notes,clip, data, idlePeriodDuration,patternDuration){
        console.log(`MidiToVideoConstructor channel: ${channel}, notes: ${notes}, clip: ${clip}, data: ${data}`)
        this.idlePeriodDuration = idlePeriodDuration
        this.patternDuration = patternDuration //* really is the duration of the PATTERN here clip means midi slice
        this.channel = channel
        this.notes = notes
        this.clip = clip
        this.processedDataArray = data
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
        //this means that the first midi note hit after 0 seconds from pattern start 
        let startsLate = this.idlePeriodDuration > 0
        //just so we can work with the first note 
        let firstIterationOfMap = true 
        //this is important?
        let firstMidiNoteFiredAt = null
        //idle periodClip?  
        let idlePeriodClip = null //this will or will not be prepended to the array, usually is present on snare tracks, stuff not coming in on the one 
        //iterate through the reorded midi events
        let commands =  this.processedDataArray.map(event => {
            //need to store the first midi note for later processing clip length 
            if(firstMidiNoteFiredAt == null){
                firstMidiNoteFiredAt = event.timeStamp
            }
            //need to know so we dont get index out of bounds for next
            let weAreAtTheEndOfArray = (this.processedDataArray.indexOf(event)) === (this.processedDataArray.length - 1)
            //we need to look ahead to determin the length of this clip, the length is the distance of time between pressing this key and the next. 
            let nextEvent = !weAreAtTheEndOfArray ? (this.processedDataArray[this.processedDataArray.indexOf(event) + 1]) : null 
            //start of clip 
            let startOfClip = event.timeStamp 
            //end of clip  for calcs
            let endOfClip

            //cop out out to avoid index out of bounds 
            if(weAreAtTheEndOfArray) {
                //
                let endPatternTimestamp
                //subtract time elapsed from total clip time to get the expected duration of the final note 
                //this only works if the pattern begins with a midi note!!! Fix this 
                //if we started late, the first clip will not really be the beginning of the sequence
                if(startsLate) {
                    //bad veriable name, this is more like actual midi timestamp 
                    let actualFirstMidiNoteFiredAt = firstMidiNoteFiredAt - this.idlePeriodDuration
                    //we need this in order to determine at what point to cut off the final clip  
                    endPatternTimestamp = actualFirstMidiNoteFiredAt + this.patternDuration
                    console.log(`actualFirstMidiNoteFiredAt: ${actualFirstMidiNoteFiredAt} firstMidiNoteFiredAt: ${firstMidiNoteFiredAt}`)
                } else {
                    //pattern duration is calculated based on bpm and bar count
                    endPatternTimestamp = firstMidiNoteFiredAt + this.patternDuration
                }
                endOfClip = endPatternTimestamp
                console.log(`endPatternTimestamp: ${endPatternTimestamp}, startOfClip: ${startOfClip}, firstMidiNoteFiredAt: ${firstMidiNoteFiredAt} patternduration: ${this.patternDuration} endofClip: ${endOfClip}`)
            } else {
                //we arent there yet  s
                endOfClip = nextEvent.timeStamp
            }
            //nothing out of the ordinary here 
            let clipLength = this.convertMillisecondsToSeconds(endOfClip - startOfClip)  
            //generate SLICE
            console.log(event.noteNumber)
            let sliceStart = this.convertTimeStampToSecondsInteger(
                this.getBeginningOfSlice(event)
            )
            //we are taking the first clip and copying it, we will prepend to the array to 
            //give some footage in the idle period duration. This can probably be improved greatly 
            //but you know. Its just me working on this soooo...... 
            //sorry not sorry? 
            if (startsLate && firstIterationOfMap) {
                //meaning first note 
                firstIterationOfMap = false 
                console.log("[IDLE_PERIOD DURATION] greater than zero, value is: " + this.idlePeriodDuration + " milliseconds")
                let idlePeriodAsSeconds = this.convertMillisecondsToSeconds(this.idlePeriodDuration) 
                idlePeriodClip = `ffmpeg -an -y -ss ${sliceStart} -i ${this.clip} -t ${idlePeriodAsSeconds} -c:v libx264 ${path.join(this.app_root)}/midi_slices/channel_${this.channel}/${0}.mp4`
            }

            return `ffmpeg -an -y -ss ${sliceStart} -i ${this.clip} -t ${clipLength} -c:v libx264 ${path.join(this.app_root)}/midi_slices/channel_${this.channel}/${event.timeStamp}.mp4`

        })
        if(idlePeriodClip) {
            console.log(commands.length) 
            console.log("unshift the idlePeriodClip")
            commands.unshift(idlePeriodClip)  
            console.log(commands.length)  
        }
        return commands 

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

