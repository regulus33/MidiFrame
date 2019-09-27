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

  
    const renderer = TestRenderer.create(<VideoSelectorContainer videoSelectorGet={videoSelectorGetMocked} />)
    const testInstance = renderer.root;
    

    return Promise.allSettled([innermostPromise, fakeVidFetch]).then(()=>{
        done()
        expect(testInstance.findAllByType(Option)[0].props.value).toBe("path/to/video1.mp4")

    })



    

});
