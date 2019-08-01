const express = require('express');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const bodyParser = require('body-parser');
const app = express();
var path = require('path');
const fs = require('fs').promises;
var fileUpload = require('express-fileupload');

// This must run inside a function marked `async`:


//use this to determine which chanel an input comes from 

//http://computermusicresource.com/MIDI.Commands.html?source=post_page---------------------------
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


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(fileUpload());


// parse application/json
app.use(bodyParser.json())

const port = 3000

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/midi.html')))

app.get('/recorder.js', (req, res) => res.sendFile(path.join(__dirname + '/vendor/recorder.js')))

app.listen(port, () => console.log(`Listening on ${port}!`))

app.post('/midi',function(req,res){
    const song = req.body 
    console.log(song);
    console.log("writing song");
    res.end("yes");
    // const file = await fs.readFile('filename.txt', 'utf8');
   writeMidi(song)
    console.log("file is written file")
});


app.post('/audio', (req, res) => {
    debugger
    console.log(req.files.data);
    
    req.files.audio_data.mv(path.join(__dirname + '/test.wav'), (err) => {
      if (err) {
        console.log(err);
      }
    });
});

async function writeMidi(midiJson) {
    await fs.writeFile(path.join(__dirname + '/json/miditest.json'), JSON.stringify(midiJson));
}




const createVideo = (jsonMidi) => {
    

    //build correct data object


    
    //https://trac.ffmpeg.org/wiki/Concatenate
    // async function ls() {
    //   const { stdout, stderr } = await exec('ls');
    //   console.log('stdout:', stdout);
    //   console.log('stderr:', stderr);
    // }
    // ls();

    //event_pair = [{start: 46665, stop: 5778, channel: 3}]
    //generate empty video of track length
    //now join videos at even timestamps, trim to be duratio of note on to off and insert at timestamp. 


}