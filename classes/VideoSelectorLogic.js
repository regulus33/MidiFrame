const fs = require('fs')
const path = require('path')
//TODO: eventually it would be nice to make server code compile with babel 
module.exports = {

    fetchVideoFilePaths: function () {
        //todo: extract this into a proper method
        let videoPath = path.join(__dirname).split("/")
        videoPath.pop()
        videoPath = videoPath.join("/");
        videoPath += "/assets/video_bank/"
        return fs.readdirSync(videoPath).filter(value =>{
            return value != ".DS_Store"
        }).map(fileName => videoPath + fileName )
         

    }

}


