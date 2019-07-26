const express = require('express');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const bodyParser = require('body-parser');
const app = express();
var path = require('path');
const fs = require('fs').promises;

// This must run inside a function marked `async`:


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const port = 3000

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/midi.html')))

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


async function writeMidi(midiJson) {
    await fs.writeFile(path.join(__dirname + '/json/miditest.json'), JSON.stringify(midiJson));
}




const createVideo = (jsonMidi) => {
    
    //https://trac.ffmpeg.org/wiki/Concatenate
    // async function ls() {
    //   const { stdout, stderr } = await exec('ls');
    //   console.log('stdout:', stdout);
    //   console.log('stderr:', stderr);
    // }
    // ls();

}