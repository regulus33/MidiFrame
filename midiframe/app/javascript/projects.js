
const { 
  requestMidiAccessFromChrome,
  onMidiMessageJamming,
  onRejectedAccessFromChrome
} = require('./shared.js');


// Got to wait for dom to load
window.onload = (event) => {

    const fileInputTag = document.getElementById("project_video");
    const fileNameDisplayerSpan = document.getElementById("video_file_name");
    const newPatternButton = document.getElementById('newPatternButton');
    
    // Make file input button display video filename with out own styles 
    fileInputTag.addEventListener('change', (event) => {
        //split path and pop off the filename only:
        fileNameDisplayerSpan.innerText = event.target.value.split('\\').pop();  
    });

    // Request midi access before navigating to pattern editor
    new_pattern_button.onclick = (event) => {
     
      event.preventDefault();

      requestMidiAccessFromChrome({
        //once we get access call our function that will nav us to the pattern page but give them the a tag to call click on
        onReceiveAccessFromChrome : () => navigateToPatternEditor(event.target),
        onReceiveMidiMessage: onMidiMessageJamming, 
        onRejectedAccessFromChrome, 

      });
    }
    //I only added this handler in this file because all the other handlers being passed
    //to requestMidiAccessFromChrome are generic and re-useable 
    const navigateToPatternEditor = (anchor) => {
      debugger 
      anchor.click();
    }
    
};






