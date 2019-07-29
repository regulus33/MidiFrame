const express = require('express');
const util = require('util');
// const exec = util.promisify(require('child_process').exec);
const { exec } = require('child_process');
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


channelStartPoints = {
    "1":2.45,
    "2":3.67,
    "3":6.78,    
}

channelVideos = {
    "1":"test_a.mp4",
    "2":"test_b.mp4",
    "3":"test_b.mp4" 
}


midiFile = path.join(__dirname + '/json/miditest.json')


fs.readFile(midiFile, 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data); 
    
    jsonData = JSON.parse(data);

    sortAndProcessData(jsonData);
    //kick drum has priority or channel 1
    fs.writeFileSync(path.join(__dirname + '/json/processed.json'), JSON.stringify(sortedChannels));

    sortedChannels["1"].forEach((e) => {
        let start = channelStartPoints["1"]
        let video = channelVideos["1"]
         
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
        
    })

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
