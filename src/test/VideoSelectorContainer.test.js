import VideoSelectorContainer from '../containers/VideoSelectorContainer'
import React from 'react';
import TestRenderer from 'react-test-renderer';
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

        return Promise.allSettled([innermostPromise, fakeVidFetch]).then(() => {
            let instance = renderer.getInstance()
            instance.state.latestCapturedMidi = [{"data":["148","31","100"],"timeStamp":100}]
            instance.state.selectedChannel = "5"
            expect(instance.renderNoteInputs()[0].props.noteName).toBe(31)
            done() 
        })
            
    })


    it("usedNotesAndChannels() returns an object where keys are channel and value is an array of notes used in each of those channels",(done) => {

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
            expect(instance.usedNotesAndChannels()).toEqual({
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
        return done()
       
            
    })

    it("handleTimeStampInput() updates the state.notes to something like: {'35': '2:22', '56': '3:33'}",(done) => {
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
        instance.getTimeInputs = jest.fn() 
        instance.getTimeInputs.mockReturnValueOnce([
            {name: "56", value: "3:33"},
            {name: "35", value: "2:22"},
        ])
        instance.handleTimeStampInput()
        expect(instance.state.notes).toEqual({"35": "2:22", "56": "3:33"})
        return done()
            
    })


    it("handleChannelOptionClick() sets selected channel to state",(done) => {
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
                selectedOptions: [
                    {value:"69"}
                ]
            }
        }

        instance.handleChannelOptionClick(mockEvent)

        expect(instance.state.selectedChannel).toBe("69")

        return done()
            
    })

    it("renderOptionsForChannelPickerData() returns options for all used channels", (done) => {
        const innermostPromise = Promise.resolve(['path/to/video1.mp4', 'path/to/video.mp4'])
        const fakeVidFetch = Promise.resolve(
            {
                json: () => innermostPromise
            }
        )
        const videoSelectorGetMocked = jest.fn()
        videoSelectorGetMocked.mockReturnValueOnce(fakeVidFetch)    
        let mock = [
            {"data":["148","31","100"],"timeStamp":5254.274999955669},
            {"data":["157","31","100"],"timeStamp":5254.274999955669},
            {"data":["153","31","100"],"timeStamp":5254.274999955669},
            {"data":["148","31","100"],"timeStamp":5254.274999955669},
            {"data":["148","31","100"],"timeStamp":5254.274999955669},
        ]
        const renderer = TestRenderer.create(
            <VideoSelectorContainer 
                videoSelectorGet={videoSelectorGetMocked} 
                rawMidi={mock} 
                midiCollector={new BrowserMidiCollector()}
            />
        )
        let instance = renderer.getInstance()
        instance.state.latestCapturedMidi = mock
        //convert the react array to array of channel strings for the test
        expect(instance.renderOptionsForChannelPickerData().map((r)=>r.props.value)).toEqual(["5", "10", "14"])    
        return done()
            
    })

    it("renderOptionsForVideoDropDown() should pass AND refresh updates sstate properly ", (done) => {
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
            expect(renderer.getInstance().renderOptionsForVideoDropDown()[0].props.value).toBe("path/to/video1.mp4")
            //TODO call refresh here and update browsermidicollector first 
            return done()


        })


    });

    it("Calls BrowserMidiCollector update state when state is changed", (done) => {
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

            //TODO call refresh here and update browsermidicollector first 
            return done()


        })


    });

})


