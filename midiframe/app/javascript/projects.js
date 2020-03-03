
// const { 
  // request_midi_access_from_chrome,
  // midi_message_jamming,
// } = require('./shared.js');

window.addEventListener('load', (event) => {
    ///////////////////////////////////////////////
    //                                           //
    //   VIDEO UPLOAD INPUT BUTTON IS SO UGLY,   //
    //    THIS HIDES IT AND DISPLAYS FILENAME    //
    //          IN AN ARBITRARY SPAN             //
    //                                           //
    ///////////////////////////////////////////////
    const file_input_tag = document.getElementById("project_video");

    const fil_name_displayer_span = document.getElementById("video_file_name");

    file_input_tag.addEventListener('change', (event) => {
        //split path and pop off the filename only:
        fil_name_displayer_span.innerText = event.target.value.split('\\').pop();  
    });
    //Before the user navigates to the pattern page, we need to get their midi consent. 
    //To do this we can bind the permission function to the new project button. 
    //we'll prevent the default event (naving) and request Chrome's midi access. Once we get access we nav the user to the page 
    //if not, we throw alert telling them to plug in their device 
    const new_pattern_button = document.getElementById('new_pattern_button')
    new_pattern_button.onclick = (event) => {
      event.preventDefault();
      //passing the request to the API the callback I want to trigger each time the midi device sends us a MASSAGE 
      //it altimately returns false, but inside of a gosh dang PROMISE. Promises to keep am i right?
      //Is that all we're fuckin doin heah? Prowmissing>? PROOOOOWWWMMMISSSING>>>>>???? 
      request_midi_access_from_chrome(midi_message_jamming).then((resolved_promise)=>{
        
      });
      
   
    }

    
    
});






