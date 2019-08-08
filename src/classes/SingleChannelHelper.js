
// )  (
//      (   ) )
//       ) ( (
//  mrf_______)_
//  .-'---------|  
// ( C|/\/\/\/\/|
//  '-./\/\/\/\/|
//    '_________'
//     '-------'

//use this to determine which chanel an input comes from 

//http://computermusicresource.com/MIDI.Commands.html?source=post_page---------------------------

// M I D I ---- C H A N N E L - M A P P I N G S
//   .---------.
//   |.-------.|
//   ||>run#  ||
//   ||       ||
//   |"-------'|etf
// .-^---------^-.
// | ---~   AMiGA|
// "-------------'

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

// let this.dirty = false 

// let this.channelsAndStamps = []
//   /////setup audio recording 
// let this.gumStream;
//   //stream from getUserMedia() 
// let rec;
//   //Recorder.js object 
// let input;



//   RECORD THAT MIDI.... FAST
// +--^----------,--------,-----,--------^-,
//  | |||||||||   `--------'     |          O
//  `+---------------------------^----------|
//    `\_,---------,---------,--------------'
//      / XXXXXX /'|       /'
//     / XXXXXX /  `\    /'
//    / XXXXXX /`-------'
//   / XXXXXX /
//  / XXXXXX /
// (________(                
//  `------'   


export default class SingleChannelHelper {


    constructor(doc, window, recorder) {
        this.iterableEmojis = ["✌","😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚"]
        this.channelsAndStamps = []
        this.window = window;
        this.document = doc;
        this.dirty = false;
        this.gumStream = null;
        this.input = null;
        this.rec = null;
    }

    //first thing that needs to happen 
    //get connection to opz 
    requestMIDIAccess = () => {
        //comes from the navigator object (as per usual, thats where all the good stuff is in chrome anyway)
        navigator.requestMIDIAccess().then( access => {
          //there should really only be one here, but you never know 
          console.log(access.inputs);
          //iterate through a hopefully small array to find the midi device we care about
          const devices = access.inputs.values();
          //ditto 
          for (let device of devices ) {
            //we are setting some events we need to fire and process for capturing each event AND
            //when the use turns of the opz, we'll send our message
            //we need to swap this out with a record button. 
            if (device.name == "OP-Z") {
              console.log(device.name)
              device.onmidimessage = this.onMidiMessage //keep
              device.onstatechange = this.handleOPZChange //change to have msg sent when we hit stop button 
            }

          }
        }).catch(console.error);
    }
    //once we send the enire huge json of midi to server, we need to notify the user TODO
    onMidiSentSuccess(response){
        //TODO: notify success
        console.log(response);
    }
    //literally fires every time a midi msg is sent from the opz  
    onMidiMessage = (message) => {
      //message data 0 is telling us if we are an off or on channel and which channel (1 - 16) at the same time 
      console.log(message.data[0].toString())
      //if its an on channel or off, its relevant, so commit it to the json 
      if ((ON_CHANNELS[message.data[0].toString()] != undefined) || (OFF_CHANNELS[message.data[0].toString()] != undefined)) {
        //useless var, we should only begin recording once the user hits record. Remove tonight 
        if(this.dirty == false){
          this.setupAndBeginRecording()  
         } 
         this.dirty = true 
        //here we push into an unprocessed array, we shall return to this in a while
        this.channelsAndStamps.push({"noteChannel": message.data[0], "timeStamp": message.timeStamp })
        //////FOR FUN :)DDD///////
        ///  <<<<<<<><>>>>>>>>>>>..
        //////////////////////////
        this.document.getElementById("div").style["background-color"] = '#'+Math.floor(Math.random()*16777215).toString(16)
        ////more fuuuuuuuuuuuuuuun
        this.document.getElementById("iterableEmoji").innerText = this.iterableEmojis[Math.round(Math.random() * (this.iterableEmojis.length - 1))]
      } 
    }
    
      // send data once opz is disconnected
    handleOPZChange = (arg) => {

      if(arg.currentTarget.state == "disconnected") {
        this.sendDataMidi();
        //colects BLOB and sends the audio to the server
        this.stopRecording();
      }

    }
    
    sendDataMidi = () => {
         const Http = new XMLHttpRequest();
         const url = "http://localhost:3000/midi"
         Http.open("POST", url);
         Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
         Http.send(JSON.stringify(this.channelsAndStamps));
    
         Http.onreadystatechange = this.onMidiSentSuccess; 
    }
    
    setupAndBeginRecording = () => {
        // shim for AudioContext when it's not avb. 
        let AudioContext = this.window.AudioContext || this.window.webkitAudioContext;
        let audioContext = new AudioContext;
      //new audio context to help us record 
        let constraints = {
          audio: true,
          video: false
        } 
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          console.log("getUserMedia() success, stream created, initializing Recorder.js ..."); 
          /* assign to this.gumStream for later use */
          this.gumStream = stream;
          /* use the stream */
          this.input = audioContext.createMediaStreamSource(stream);
          //stereo 
          this.rec = new window.Recorder(this.input, {
              numChannels: 2
          }) 
          //start the recording process 
          this.rec.record()
          console.log("Recording started");
        }).catch(function(err) {
            console.log(`couldnt get user media becuase: ${err}`)
        });
    }
    
    
    stopRecording = () => {
        console.log("recording stopped")
        //tell the recorder to stop the recording 
        this.rec.stop(); //stop microphone access 
        this.gumStream.getAudioTracks()[0].stop();
        //create the wav blob and pass it on to createDownloadLink 
        this.rec.exportWAV(this.sendAudio);
    }
    
    
    sendAudio = (blob) => {
      let xhr = new XMLHttpRequest();
      xhr.onload = (e) => {
          if (this.readyState === 4) {
              console.log("Server returned: ", e.target.responseText);
          }
      };
      var fd = new FormData();
      fd.append("audio_data", blob, "test.wav");
      xhr.open("POST", "http://localhost:3000/audio", true);
      xhr.send(fd);
      console.log("send req for song audio")
    }
    //   /|
    //        =  =  =      / |
    //   ____| || || |____/  | -_-_-_-_-_-_
    // |)----| || || |____   |    MAGIC HAPPENS HERE CUZ WE NEED TO MAKE USER CLICK FIRST NOW 
    //   ((  | || || |  ))\  | _-_-_-_-_-_-
    //    \\_|_||_||_|_//  \ |
    //     \___________/    \|
    
    
    // main(){
    //   requestMIDIAccess()     
    // } //end main
    
    
    // setListener(){
    //   this.document.getElementById("div").addEventListener("click", main)
    // }
    // this.window.onload = setListener;

}

