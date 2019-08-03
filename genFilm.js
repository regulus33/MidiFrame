const express = require('express');
// const exec = util.promisify(require('child_process').exec);
// const { exec } = require('child_process');
const execSync = require('child_process').execSync;
const bodyParser = require('body-parser');
const app = express();
var path = require('path');
const fs = require('fs');

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

const sortedChannels = {
    "1":[],
    "2":[],
    "3":[],
    "4":[],
    "5":[],
    "6":[],
    "7":[],
    "8":[],
    "9":[],
    "10":[],
    "11":[],
    "12":[],
    "13":[],
    "14":[],
    "15":[],
    "16":[]
}

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


midiFile = path.join(__dirname + '/json/miditest.json')

//clear last files, TODO: make this more sensible 



fs.readFile(midiFile, 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data); 
    
    jsonData = JSON.parse(data);

    sortAndProcessData(jsonData);
    //kick drum has priority or channel 1
    fs.writeFileSync(path.join(__dirname + '/json/processed.json'), JSON.stringify(sortedChannels));
    //clean old slices 
    execSync(`rm -rf ${path.join(__dirname)}/midi_slices/channel_1/./*`)

    for(i=0; i < sortedChannels["1"].length; i++) {
        if(!sortedChannels["1"][i].noteOn) {
                //if this is note off, great! Lets go get the note on that got us here in the first place, i -1 should do it!
            let startOfNote = sortedChannels["1"][i-1].time
            let endOfNote = sortedChannels["1"][i].time 
            let clipLength =  endOfNote - startOfNote
            if(i != sortedChannels["1"].length -1 ) {
                let timeTilNext = sortedChannels["1"][i+1].time - startOfNote                                       //was cliplength 
                execSync(`ffmpeg -i ${path.join(__dirname + '/assets/video_bank/wood.mp4')} -ss ${channelStartPoints["1"]} -t ${timeTilNext} -async 1 ${path.join(__dirname)}/midi_slices/channel_1/${startOfNote}.mp4`)
            }
        }

        // let start = channelStartPoints["1"]
        // let video = channelVideos["1"]
         
        // 1. GENERATE CLIPS
        //choose 2:01 in video_pool/wood.mp4 
        //this start point will remain the same for all clips, the only variable is the end point as the midi down will vary
        //for each midi_off:
        // subtract the midi_on timestamp at index - 1 in the array (it will always be preceded by its instigator) as LENGTH
        // and split the video from 2:01 to LENGTH
        // and generate folder name = temp_<titel>_<timestamp> 
        // name each outputed file the startpoint at which to begin the video, ie, the note_on event that it belongs to's timestamp
        
        //2. HANDLE SILENCE 
        //Silence can be thought of as the time between midi clips. 
        // note_on: 1, note_off: 3,[HERE IS WHERE SILENCE IS 2 IN THIS CASE] note_on: 5, note_off: 7
        //silence will be the difference between note_off to note_on
        //repeat the above steps but instead of using wood, use empty.mp4 and set start time to 0.
        //put the sliced files in the same directory as previos step used

        //3. MERGE CLIP
        //finally, sort all files by title in numerical order from smallest in a list
        //print each file name to input.txt file, write it, run ffmpeg concat and wait :) 

        
      
        
    }

    concatInstructionsString = ""

    //video trim now complete, time to concat all files 
    const directoryPath = path.join(__dirname, '/midi_slices/channel_1');
    //passsing directoryPath and callback function
    var files =  fs.readdirSync(directoryPath)
        // //handling error
        // if (err) {
        //     return console.log('Unable to scan directory: ' + err);
        // } 
        //listing all files using forEach
        files.forEach((file) => {
            console.log(file); 
            if(file != ".DS_Store") {
                concatInstructionsString += "file" + " '" + path.join(__dirname + "/midi_slices/channel_1/") + file + "'" + "\n"
            }   

        });
        fs.writeFileSync(path.join(__dirname + '/input.txt'), concatInstructionsString );

        execSync(`ffmpeg -f concat -safe 0 -i ${path.join(__dirname + '/input.txt')} -c copy outputs/video_${Date.now()}.mp4`)
            

});

const sortAndProcessData = (data) => {
    data.forEach((event) => {

        if(OFF_CHANNELS[event.noteChannel.toString()] != undefined) {
            //push value into array of this channel //gets the actuall channel number to string 
            sortedChannels[OFF_CHANNELS[event.noteChannel.toString()]].push({noteOn: false, time: millisToMinutesAndSeconds(event.timeStamp)})
        } else {
            sortedChannels[ON_CHANNELS[event.noteChannel.toString()]].push({noteOn: true, time: millisToMinutesAndSeconds(event.timeStamp)})
        }
    })
    
}

const millisToMinutesAndSeconds = (millis) => millis/1000
