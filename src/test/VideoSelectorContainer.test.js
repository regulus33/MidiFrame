/**
 * @jest-environment node
 */
import VideoSelectorContainer from '../containers/VideoSelectorContainer'
import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer from 'react-test-renderer';
import util from 'util'
// Test to get all students record
it("video-selector returns an array of video assets", (done) => {

    const nock = require('nock');
    const request = require('request');
    
    const baseURL = 'http://localhost:3000';
    const path = '/video-selector';

    nock(baseURL)
        .get(path)
        .reply(200, 'ok');
    
    // request({
    //     uri: baseURL + path,
    // }, console.log);

    const renderer = TestRenderer.create(<VideoSelectorContainer/>)
    const instance = renderer.root 
    // console.log(util.inspect(instance))
    //onsole.log(util.inspect(instance._fiber.stateNode.state))
    
  
    

});
