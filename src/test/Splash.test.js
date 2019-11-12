import Splash from "../Splash.js"
import ShallowRenderer from 'react-test-renderer/shallow';
import React from "react"

// Test to get all students record
it("Displays props correctly", () => {
    
    const renderer = new ShallowRenderer()
    renderer.render(<Splash userMessage={"Spicy Tacos Hurt On the Way out as well"}/>)
    const result = renderer.getRenderOutput();
    
 
});
