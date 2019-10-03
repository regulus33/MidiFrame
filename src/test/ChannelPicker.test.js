import React from 'react';
import ReactDOM from 'react-dom';
import ChannelPicker from '../ChannelPicker.js';
import ShallowRenderer from 'react-test-renderer/shallow';

it('Channel Picker Renders props properly', () => {
    let thingyToRenderrrrrrrr = "random rendered string, doesn't matter what it is as long as I am rendered insiiiiiiiide"
    const fakePropsFunction = jest.fn()
    fakePropsFunction.mockReturnValueOnce(thingyToRenderrrrrrrr)  
    const renderer = new ShallowRenderer()
    renderer.render(<ChannelPicker renderOptionsForDropDown={fakePropsFunction}/>)
    const result = renderer.getRenderOutput();
    expect(result.props.children).toEqual([<span>Channel</span>, <select>random rendered string, doesn't matter what it is as long as I am rendered insiiiiiiiide</select>])

});
