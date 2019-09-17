const fetchVideoFilePaths = require('./classes/VideoSelectorLogic.js').fetchVideoFilePaths

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const execSync = require('child_process').execSync;
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(fileUpload());
app.use(bodyParser.json())
const port = 3000
app.listen(port, () => console.log(`Listening on ${port}!`))

//ENDPOINTS
// app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/views/midi.html')))

app.get('/video-selector', (req, res) => {
  console.log("receinving requessts")
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify(fetchVideoFilePaths())
  )
})

// app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/views/midi.html')))


app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); 

export default app 
// app.post('/midi',(req,res) => {
   
//     console.log('\x1b[36m%s\x1b[0m', 'POST /midi'); 


//     let jsonContent = JSON.stringify(req.body);
// console.log(jsonContent);
 
// fs.writeFile("consistent_midi_track3_opz.json", jsonContent, 'utf8', function (err) {
//     if (err) {
//         console.log("An error occured while writing JSON Object to File.");
//         return console.log(err);
//     }

//     console.log("JSON file has been saved.");
// });
    
//     // const song = req.body; 
     
//     // mapper = new SingleVideoChannelMapper("1","wood.mp4",song);

//     // mapper.sliceChannelVid();

//     // let pathFile = mapper.buildFFMPEGConcatFile("input");
    
//     // mapper.executeConcat(pathFile);

//     res.end("OK");

// });

// app.post('/audio', (req, res) => { 
//     console.log('\x1b[36m%s\x1b[0m', 'POST /audio');   
//     let fileName = "audio_" + Date.now() 
//     execSync(`rm -rf ${path.join(__dirname)}/assets/audio/./*`)
//     req.files.audio_data.mv(path.join(__dirname + `/assets/audio/song.wav`), (err) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(`Audio file written to: /assets/audio/song.wav`);
//       }
//     });
//     res.end("OK");
// });



