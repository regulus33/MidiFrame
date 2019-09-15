const fs = require('fs')
const path = require('path')


export function fetchVideoFilePaths() {
    //todo: extract this into a proper method
    let videoPath = path.join(__dirname).split("/")
    videoPath.pop()
    videoPath.pop()
    videoPath = videoPath.join("/");
    videoPath += "/assets/video_bank/"

    return fs.readdirSync(videoPath)

}

