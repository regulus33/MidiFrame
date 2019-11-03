import VideoSelectorContainer from '../containers/VideoSelectorContainer'
import React from 'react';
import TestRenderer from 'react-test-renderer';
import BrowserMidiCollector from '../classes/BrowserMidiCollector'
import Option from '../Option.js'

import MidiPlayerLive from '../classes/MidiPlayerLive.js'

it("converts 3:45 style time to a seconds integer", () => {

    let player = new MidiPlayerLive()

    expect(player.convertMinutesToSeconds("3:34")).toBe(214)

})
