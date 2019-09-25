
import VideoSelectorContainer from '../containers/VideoSelectorContainer'
import VideoSelector from '../VideoSelector'
import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer from 'react-test-renderer';
import util from 'util'
import { exportAllDeclaration } from '@babel/types';
// Test to get all students record
it("video-selector returns an array of video assets", (done) => {
    const nock = require('nock');
    const request = require('request');
    
    const baseURL = 'http://localhost:3000';
    const path = '/video-selector';

    nock(baseURL)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get(path)
        .reply(200, JSON.stringify(["moomoo.moomoo.mp4"]))
        .once(done())
    
    // request({
    //     uri: baseURL + path,
    // }, console.log);

    const renderer = TestRenderer.create(<VideoSelectorContainer/>)
    const instance = renderer.root 

    expect(renderer.toJSON()).toBe(true)
    // console.log(util.inspect(instance))
    //onsole.log(util.inspect(instance._fiber.stateNode.state))
        
  
    

});
