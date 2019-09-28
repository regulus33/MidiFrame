import {fetchVideoFilePaths} from '../../classes/VideoSelectorLogic.js'

const mockFS = require('mock-fs');


test('fetchVideoFilePaths() returns an array of vid files', () => {
    
    let app_root = __dirname.split("/")
    app_root.pop()
    app_root.pop()
    app_root = app_root.join('/')

    let fakeChannelDir = {}

    fakeChannelDir[`${app_root}/assets/video_bank`] = {
        "dumpyJoesVideoHosssssssss.mp4":"Yo this is a video I promise",
        "memeImatootman.mp4":"psssssssstffffft"
    }

    mockFS(fakeChannelDir);
    
    expect(fetchVideoFilePaths()[0]).toEqual(`${app_root}/assets/video_bank/dumpyJoesVideoHosssssssss.mp4`)

    mockFS.restore()


})