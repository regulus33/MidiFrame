const express = require('express');
const util = require('util');
const execSync = require('child_process').execSync;
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

// This must run inside a function marked `async`:

//use this to determine which chanel an input comes from 

//http://computermusicresource.com/MIDI.Commands.html?source=post_page---------------------------


//CONFIG
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload());
// parse application/json
app.use(bodyParser.json())
const port = 3000
app.listen(port, () => console.log(`Listening on ${port}!`))

//ENDPOINTS

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/views/midi.html')))

app.post('/midi',(req,res) => {

    const song = req.body 

    res.end("OK");

   writeMidi(song)


});

app.post('/audio', (req, res) => {    
    let fileName = "audio_" + Date.now() 
    req.files.audio_data.mv(path.join(__dirname + `/assets/audio/${fileName}.wav`), (err) => {
      if (err) {
        console.log(err);
      } else {
          console.log(`File written to: `)
      }
    });
});

 const writeMidi = (midiJson) => {
    fs.writeFileSync(path.join(__dirname + '/json/miditest.json'), JSON.stringify(midiJson));
    execSync("node genFilm.js")

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