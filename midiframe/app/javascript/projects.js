

window.addEventListener('load', (event) => {
    ///////////////////////////////////////////////
    //                                           //
    //   VIDEO UPLOAD INPUT BUTTON IS SO UGLY,   //
    //    THIS HIDES IT AND DISPLAYS FILENAME    //
    //          IN AN ARBITRARY SPAN             //
    //                                           //
    ///////////////////////////////////////////////
    const fileInputTag = document.getElementById("project_video");
    const fileNameDisplayerSpan = document.getElementById("video_file_name");
    fileInputTag.addEventListener('change', (event) => {
        //split path and pop off the filename only:
        fileNameDisplayerSpan.innerText = event.target.value.split('\\').pop()  
    });
    //
});



