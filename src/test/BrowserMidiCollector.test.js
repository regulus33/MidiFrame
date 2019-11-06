import VideoSelectorContainer from '../containers/VideoSelectorContainer'
import React from 'react';
import TestRenderer from 'react-test-renderer';
import BrowserMidiCollector from '../classes/BrowserMidiCollector'
import Option from '../Option.js'

// it("Scrapes duh forrrrmmmmmssss", (done) => {

//     const innermostPromise = Promise.resolve(['path/to/video1.mp4', 'path/to/video.mp4'])

//     const fakeVidFetch = Promise.resolve(
//         {
//             json: () => innermostPromise
//         }
//     )

//     const videoSelectorGetMocked = jest.fn()
//     videoSelectorGetMocked.mockReturnValueOnce(fakeVidFetch)    
//     let mock = [{"data":["148","31","100"],"timeStamp":5254.274999955669}]
  
//     const renderer = TestRenderer.create(<VideoSelectorContainer videoSelectorGet={videoSelectorGetMocked} rawMidi={mock} />)
//     const testInstance = renderer.root;
// //DIDNT WE DECIDE THIS WAS UNNECCESSSARRYY
//     // expect(3).toBe(4)
//     return Promise.allSettled([innermostPromise, fakeVidFetch]).then(()=>{
//         //first option picker is channel 
//         expect(testInstance.findAllByType(Option)[0].props.value).toBe("5")
//         //second is video path 
//         expect(testInstance.findAllByType(Option)[1].props.value).toBe("path/to/video1.mp4")
//         const form = new BrowserMidiCollector()
        
//         expect(form.selectedData).toEqual({"5":[{67:"3:45"},"path/to/video.mp4"]})
//         done()

//     })
    

// })


it("converts a raw midi.js event to a parceable, meaningfull object", () => {
    let singleEvent = {"data":["149","60","100"],"timeStamp":5502.5799999712035}
    const b = new BrowserMidiCollector()
    let result = b.translateForeignMidiEvent(singleEvent)
    expect(result).toEqual({
        channel: "6", 
        noteNumber: "60",
    })
})

it("Does not touch midi off notes", () => {
    let singleEvent = {"data":["128","60","100"],"timeStamp":5502.5799999712035}
    const b = new BrowserMidiCollector()
    let result = b.translateForeignMidiEvent(singleEvent)
    expect(result).toEqual(null)
})

it("updateState() preserves state accross changes to the video selector's state", () => {
    let pretendState = {
    videoFiles:['thePath.mp4'], 
    selectedVideoPath: "thePath.mp4", 
    selectedChannel: "1", 
    notes:{
        53: "3:45",
        54: "",
        56: "",
        57: "",
        58: "",
        60: "",
        67: ""
    }, 
    latestCapturedMidi:[
            {
                "data":["148","31","100"],
                "timeStamp":5254.274999955669
            }
        ]
    }

    let midiCollector = new BrowserMidiCollector()
    let options = {}
    options.channel = "6"
    options.videoPath = "35InaMillion.mpeg"
    options.notes = pretendState.notes
    midiCollector.updateState(options)

    expect(midiCollector.midiData["6"].notes[53]).toBe("3:45")

    options.channel = "8"
    options.videoPath = "1manpuddleeee.mpeg"

    midiCollector.updateState(options)

    expect(midiCollector.midiData["6"].notes[53]).toBe("3:45")
    expect(midiCollector.midiData["8"].notes[53]).toBe("3:45")



    
})
