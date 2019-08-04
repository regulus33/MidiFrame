const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const SingleVideoChannelMapper = require('./classes/SingleVideoChannelMapper.js')

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

    const song = req.body; 
     
    mapper = new SingleVideoChannelMapper("1","wood.mp4",song);

    mapper.sliceChannelVid();

    let pathFile = mapper.buildFFMPEGConcatFile("input");
    
    mapper.executeConcat(pathFile);

    res.end("OK");

});

app.post('/audio', (req, res) => {    
    let fileName = "audio_" + Date.now() 
    req.files.audio_data.mv(path.join(__dirname + `/assets/audio/${fileName}.wav`), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`File written to: `);
      }
    });
});



