import React from 'react'
import { thisExpression } from '@babel/types';


const fs = require('fs')


class VideoSelecter extends React.Component {

    constructor(props) {
        super(props);
        //for our array in assets s
        this.state = {videoFiles:[]};
        this.renderOptionsForDropDown = this.renderOptionsForDropDown.bind(this);
    }

    componentDidMount(){
        this.fetchVideoFilePaths()
    }

    fetchVideoFilePaths() {
        fetch('http://localhost:3000/video-selector').then(res => {
            console.log(res)
            res.json().then((r) => {
                this.setState({videoFiles:r})
            })
        })
    }

    renderOptionsForDropDown() {
        return this.state.videoFiles.map((address) => {
            let nameOfSelectedVideo = address.split("/").pop()
            return (
                <option value={address}>{nameOfSelectedVideo}</option>
            )
        })

    }

    render() {
        return (
            <div>
                <select>
                    { this.renderOptionsForDropDown() }
                </select>
            </div>
        )
    }

}

export default VideoSelecter