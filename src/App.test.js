import App from "./App.js"
import React from "react"
import TestRenderer from 'react-test-renderer';

// Test to get all students record
it("Displays a press m message when app first loads", () => {
    
    const m = TestRenderer.create(<App/>)
    expect(m.getInstance().determineAppState()).toBe("SHOW_PRESS_M")


});

it("Displays a screen asking for midi input when m pressed", () => {
  const m = TestRenderer.create(<App/>)
  m.getInstance().state.midiInteracted = true 
  expect(m.getInstance().determineAppState()).toBe("SHOW_PLAY_MIDI")

});

it("Displays the app when midi intaken and m pressed", () => {
  const m = TestRenderer.create(<App/>)
  m.getInstance().state.midiInteracted = true 
  m.getInstance().midiCollector.receivedAnyMessageYet = true 
  expect(m.getInstance().determineAppState()).toBe("SHOW_MAIN_APP")

});

