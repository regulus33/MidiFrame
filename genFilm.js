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



midiFile = path.join(__dirname + '/json/miditest.json')


fs.readFile(midiFile, 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data); 
    
    jsonData = JSON.parse(data);

    sortAndProcessData(jsonData);
    //kick drum has priority or channel 1
    fs.writeFileSync(path.join(__dirname + '/json/processed.json'), JSON.stringify(sortedChannels));

    sortedChannels["1"].forEach((e) => {
        e.timeStamp[]
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
