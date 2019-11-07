import VideoSelectorContainer from '../containers/VideoSelectorContainer'
import React from 'react';
import TestRenderer from 'react-test-renderer';
import Option from '../Option.js'
import BrowserMidiCollector from '../classes/BrowserMidiCollector';

describe("VideoSelectorContainer",() => {


    it("renderNoteInputs() returns array of text inputs with note numbers as names",(done) => {

        const innermostPromise = Promise.resolve(['path/to/video1.mp4', 'path/to/video.mp4'])

        const fakeVidFetch = Promise.resolve(
            {
                json: () => innermostPromise
            }
        )
    
        const videoSelectorGetMocked = jest.fn()
        videoSelectorGetMocked.mockReturnValueOnce(fakeVidFetch)    
        let mock = [{"data":["148","31","100"],"timeStamp":5254.274999955669}]


        const renderer = TestRenderer.create(
            <VideoSelectorContainer 
                videoSelectorGet={videoSelectorGetMocked} 
                rawMidi={mock} 
                midiCollector={new BrowserMidiCollector()}
            />
        )
        return Promise.allSettled([innermostPromise, fakeVidFetch]).then(()=>{
            let instance = renderer.getInstance()
            instance.state.latestCapturedMidi = [{"data":["148","31","100"],"timeStamp":100}]
            instance.state.selectedChannel = "5"
            expect(instance.renderNoteInputs()[0].props.noteName).toBe(31)
            done() 
        })
            
    })


    it("getUsedNotesObject() returns an object where keys are channel and value is an array of notes used in each of those channels",(done) => {

        const innermostPromise = Promise.resolve(['path/to/video1.mp4', 'path/to/video.mp4'])

        const fakeVidFetch = Promise.resolve(
            {
                json: () => innermostPromise
            }
        )
    
        const videoSelectorGetMocked = jest.fn()
        videoSelectorGetMocked.mockReturnValueOnce(fakeVidFetch)    
        let mock = [{"data":["148","31","100"],"timeStamp":5254.274999955669}]


        const renderer = TestRenderer.create(
            <VideoSelectorContainer 
                videoSelectorGet={videoSelectorGetMocked} 
                rawMidi={mock} 
                midiCollector={new BrowserMidiCollector()}
            />
        )
        return Promise.allSettled([innermostPromise, fakeVidFetch]).then(()=>{
            let instance = renderer.getInstance()
            instance.state.latestCapturedMidi = [{"data":["148","31","100"],"timeStamp":100}]
            instance.state.selectedChannel = "5"
            expect(instance.getUsedNotesObject()).toEqual({
                "5": [31]
            })
            done() 
        })
            
    })

    it("handleVideoOptionClick() sets the state of selected vid path",(done) => {

        const innermostPromise = Promise.resolve(['path/to/video1.mp4', 'path/to/video.mp4'])

        const fakeVidFetch = Promise.resolve(
            {
                json: () => innermostPromise
            }
        )
    
        const videoSelectorGetMocked = jest.fn()
        videoSelectorGetMocked.mockReturnValueOnce(fakeVidFetch)    
        let mock = [{"data":["148","31","100"],"timeStamp":5254.274999955669}]


        const renderer = TestRenderer.create(
            <VideoSelectorContainer 
                videoSelectorGet={videoSelectorGetMocked} 
                rawMidi={mock} 
                midiCollector={new BrowserMidiCollector()}
            />
        )

        let instance = renderer.getInstance()

        let mockEvent = {
            target:{
                selectedOptions:[{value:"fakeOptionValue"}]
            }
        }
        instance.handleVideoOptionClick(mockEvent)

        expect(instance.state.selectedVideoPath).toBe("fakeOptionValue")

        return Promise.allSettled([innermostPromise, fakeVidFetch]).then(()=>{
            let instance = renderer.getInstance()
            instance.state.latestCapturedMidi = [{"data":["148","31","100"],"timeStamp":100}]
            instance.state.selectedChannel = "5"
            expect(instance.getUsedNotesObject()).toEqual({
                "5": [31]
            })
            done() 
        })
            
    })

    // it("video-selector returns an array of video assets", (done) => {

    //     const renderer = TestRenderer.create(
    //         <VideoSelectorContainer 
    //             videoSelectorGet={videoSelectorGetMocked} 
    //             rawMidi={mock} 
    //             midiCollector={new BrowserMidiCollector()}
    //         />
    //     )
    //     const testInstance = renderer.root;
        

    //     return Promise.allSettled([innermostPromise, fakeVidFetch]).then(()=>{
    //         debugger
    //         //first option picker is channel 
    //         console.log(testInstance.findAllByType(Option))
    //         // expect(testInstance.findAllByType(Option)[0].props.value).toBe("5")
    //         //second is video path 
    //         // expect(testInstance.findAllByType(Option)[1].props.value).toBe("path/to/video1.mp4")
    //         done()


    //     })


    // });

})


