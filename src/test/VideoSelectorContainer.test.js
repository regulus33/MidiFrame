
import VideoSelectorContainer from '../containers/VideoSelectorContainer'
import VideoSelector from '../VideoSelector'
import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer from 'react-test-renderer';
import util from 'util'
import { exportAllDeclaration } from '@babel/types';
import { promised } from 'q';
global.fetch = require('jest-fetch-mock')
// Test to get all students record
it("video-selector returns an array of video assets", (done) => {

    const moomoo = Promise.resolve(['jjj', 'pooppeep'])

    const shittyFetch = Promise.resolve(
        {
            json: () => moomoo
        }
    )

    const videoSelectorGetMocked = jest.fn()
    videoSelectorGetMocked.mockReturnValueOnce(shittyFetch)    

    const renderer = TestRenderer.create(<VideoSelectorContainer videoSelectorGet={videoSelectorGetMocked} />)
    const instance = renderer.root 

    return Promise.allSettled([moomoo]).then(()=>{
        expect(renderer.toJSON()).toBe(true)

    })



    

});
