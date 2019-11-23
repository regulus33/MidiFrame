import MidiRecorderContainer from '../containers/MidiRecorderContainer'
import React from 'react';
import TestRenderer from 'react-test-renderer';
import BrowserMidiCollector from '../classes/BrowserMidiCollector';

describe("MidiRecorderContainer",() => {



    it("renderNoteInputs renders notes",(done) => {
        let midiCollector = new BrowserMidiCollector()
        const renderer = TestRenderer.create(
            <MidiRecorderContainer 
                midiCollector={midiCollector}
            />
        )
        
      
    
    })


})