import VideoDisplayer from "../VideoDisplayer.js"
import ShallowRenderer from 'react-test-renderer/shallow';
import { exportAllDeclaration } from "@babel/types";
import React from "react"

// Test to get all students record
it("Displays a video when supplied path and filet extension", (done) => {
    
    const renderer = new ShallowRenderer()
    renderer.render(<VideoDisplayer videoPath={"path/to/video.mp4"} fileExtension={"mp4"} />)
    const result = renderer.getRenderOutput();
    done()
    expect(result.props.children).toEqual(
        [<h1>
            editing notes on midi channel 
            <span
                style={
                    Object = {
                       "color": "#f5da42",
                       "fontSize": "40px",
                     }
                }
            />
        </h1>, 
        <video 
            autoPlay={true} 
            controls={true}
            name="media" 
            src="http://localhost:3000/video?video_path=path/to/video.mp4" 
            type="video/mp4" 
        />
        ]
    )


});
