import ProjectManagerContainer from '../containers/ProjectManagerContainer.js'
import TestRenderer from 'react-test-renderer'
import BrowserMidiCollector from '../classes/BrowserMidiCollector.js'
import React from 'react'


describe("ProjectManagerContainer",() => {

  it('renders', () => {

    

    const midiCollector = new BrowserMidiCollector()

    midiCollector.midiData = {
        "1":{notes: [1,2,3], videoPath: "path.mp4"},
        "2":{notes: [1,2,3], videoPath: "path.mp4"},
        "3":{notes: [1,2,3], videoPath: "path.mp4"},
        "4":{notes: [1,2,3], videoPath: "path.mp4"},
        "5":{notes: [1,2,3], videoPath: "path.mp4"},
        "6":{notes: [1,2,3], videoPath: "path.mp4"},
        "7":{notes: [1,2,3], videoPath: "path.mp4"},
        "8":{notes: [1,2,3], videoPath: "path.mp4"},
        "9":{notes: [1,2,3], videoPath: "path.mp4"},
        "10":{notes: [1,2,3], videoPath: "path.mp4"}
    }

    const renderer = TestRenderer.create(<ProjectManagerContainer midiCollector={midiCollector}/>)

    const instance = renderer.getInstance()



  })

})