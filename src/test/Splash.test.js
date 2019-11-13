import Splash from "../Splash.js"
import ShallowRenderer from 'react-test-renderer/shallow';
import React from "react"

// Test to get all students record
it("Shows right message when it receives SHOW_PRESS_M at appstate", () => {
    const renderer = new ShallowRenderer()
    renderer.render(<Splash userMessage={"Spicy Tacos Hurt On the Way out as well"} appState={"SHOW_PRESS_M"}/>)
    const result = renderer.getRenderOutput();
    expect(result.props.children[0].props.children).toBe("PRESS M KEY")
})

it("Shows right custom user message", () => {
    const renderer = new ShallowRenderer()
    renderer.render(<Splash userMessage={"Spicy Tacos Hurt On the Way out as well"} appState={"SHOW_PLAY_MIDI"}/>)
    const result = renderer.getRenderOutput();
    expect(result.props.children[1].props.children).toBe("Spicy Tacos Hurt On the Way out as well")
})

it("Shows right message when it receives SHOW_PLAY_MIDI at appstate", () => {
    const renderer = new ShallowRenderer()
    renderer.render(<Splash userMessage={"Spicy Tacos Hurt On the Way out as well"} appState={"SHOW_PLAY_MIDI"}/>)
    const result = renderer.getRenderOutput();
    expect(result.props.children[0].props.children).toBe('PLAY SOME MIDI NOTES THEN HIT "ENTER"')
})

