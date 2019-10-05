import VideoSelectorContainer from '../containers/VideoSelectorContainer'
import React from 'react';
import TestRenderer from 'react-test-renderer';
import Option from '../Option.js'

// Test to get all students record
it("video-selector returns an array of video assets", (done) => {

    const innermostPromise = Promise.resolve(['path/to/video1.mp4', 'path/to/video.mp4'])

    const fakeVidFetch = Promise.resolve(
        {
            json: () => innermostPromise
        }
    )

    const videoSelectorGetMocked = jest.fn()
    videoSelectorGetMocked.mockReturnValueOnce(fakeVidFetch)    
    let mock = [{"data":["148","31","100"],"timeStamp":5254.274999955669}]
  
    const renderer = TestRenderer.create(<VideoSelectorContainer videoSelectorGet={videoSelectorGetMocked} rawMidi={mock} />)
    const testInstance = renderer.root;
    

    return Promise.allSettled([innermostPromise, fakeVidFetch]).then(()=>{
        done()
        //first option picker is channel 
        expect(testInstance.findAllByType(Option)[0].props.value).toBe("5")
        //second is video path 
        expect(testInstance.findAllByType(Option)[1].props.value).toBe("path/to/video1.mp4")

    })



    

});
