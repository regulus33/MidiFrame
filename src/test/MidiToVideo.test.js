import MidiToVideo from '../../classes/MidiToVideo.js'
import { readFileSync } from 'fs';

const mockFS = require('mock-fs');
const fs = require('fs')

//otherwisse tests fail like the dickens
afterAll(() => {
    mockFS.restore()
})

test('getMidiChannel() has constructor with proper functions', () => {
    
    let channel, notes, clip, data 

    channel = "3"
    notes = {"134":"3:45"}
    clip = "beethoven.mp4"
    data = {
        "3": [
            {
                noteOn: true,
                timeStamp: 1,
                noteNumber: '54',
                velocityNumber: '100'
            }
            ]
            
      }

    let m = new MidiToVideo(channel,notes,clip,data)

    expect(m.processedDataArray[0].noteNumber).toBe('54')


})

test('getBeginningOfSlice() returns the timestamp that the user selected for this note', () => {
    
    let channel, notes, clip, data 

    channel = "3"
    notes = {"54":"3:45"}
    clip = "beethoven.mp4"
    data = {
        "3": [
                {
                    noteOn: true,
                    timeStamp: 1,
                    noteNumber: '54',
                    velocityNumber: '100'
                }
            ]
            
    }

    let event = {
        noteOn: true,
        timeStamp: 1,
        noteNumber: '54',
        velocityNumber: '100'
    }
    let m = new MidiToVideo(channel,notes,clip,data)
    let result = m.getBeginningOfSlice(event)

    expect(result).toBe("3:45")

})

test('convertTimeStampToSecondsInteger() returns seconds from stamps', () => {
    
    let channel, notes, clip, data 

    channel = "3"
    notes = {"54":"3:45"}
    clip = "beethoven.mp4"
    data = {
        "3": [
                {
                    noteOn: true,
                    timeStamp: 1,
                    noteNumber: '54',
                    velocityNumber: '100'
                }
            ]
            
    }

    let m = new MidiToVideo(channel,notes,clip,data)
    let result = m.convertTimeStampToSecondsInteger("1:30")

    expect(result).toBe(90)

})

test('generateFfmpegConcatArgsForSelf() returns a sorted array of file names to be fed to ffmpeg from smallest to largest timestamp titles', () => {
    
    let channel, notes, clip, data 

    notes = {"55":"3:33", "54":"2:22", "53": "1:11", "52": '0:00'}
    clip = "beethoven.mp4"
    data = {
        "7": [
                {
                    noteOn: true,
                    timeStamp: 1,
                    noteNumber: '55',
                    velocityNumber: '100'
                },
            ]
            
    }

    //FS SETUP
    let app_root = __dirname.split("/")
    app_root.pop()
    app_root.pop()
    app_root = app_root.join('/')


    let fakeChannelDir = {}

    fakeChannelDir[`${app_root}/midi_slices/channel_2`] = {
        "5.2323455.mp4" : "video file content",
        "0.9898909.mp4" : "more video",
        "2.2325455.mp4" : "video file content"
    }

    let m = new MidiToVideo("2",notes,clip,data)

    //create a fake filesystem and overwrite it in memory 
     mockFS(fakeChannelDir);
     //make sure this node version is sorting the readdirsync results (yeah yeah i know)
     expect(fs.readdirSync(`${app_root}/midi_slices/channel_2`)[2]).toBe("5.2323455.mp4")

    let concatArray  = m.generateFfmpegConcatArgsForSelf()
    
    let result =  "file" + " '" +`${app_root}/midi_slices/channel_2/5.2323455.mp4`+ "'" + "\n"

    expect(concatArray[2]).toBe(result)
})









