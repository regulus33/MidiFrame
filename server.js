const fetchVideoFilePaths = require('./classes/VideoSelectorLogic.js').fetchVideoFilePaths
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fileUpload = require('express-fileupload');
const MidiToVideo = require('./classes/MidiToVideo')


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


app.get('/video-selector', (req, res) => {
  console.log("receinving requessts")
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify(fetchVideoFilePaths())
  )
})


app.get('/video', function(req, res) {

  let pathToFile = req.query.video_path

  console.warn(pathToFile)

  res.sendFile(pathToFile)
})

app.post('/midi',(req,res) => {

    console.log('\x1b[36m%s\x1b[0m', 'POST /midi'); 

    Object.keys(req.body.metaData).forEach((channelKey)=>{
      console.log('\x1b[36m%s\x1b[0m', `processing channelkey: ${channelKey}`); 
      const dataObject = req.body.metaData[channelKey]
      
      const v = new MidiToVideo(
        channelKey, 
        dataObject.notes, 
        dataObject.videoPath,
        req.body.data
      )
      //here is all that will be sliced 
      console.log(v.generateChannelSliceCommands())
      //make clips
      v.makeClips() 
      //make the concat file 
      v.createInput()
      //run the ffmpeg concat command on the split files
      v.createClip()
      
    })

    res.end("OK");
})


module.exports = app 




