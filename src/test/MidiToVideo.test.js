import MidiToVideo from '../../classes/MidiToVideo.js'

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


test('generateChannelSliceCommands() returns array of valid ffmpeg commands', () => {
    
    let channel, notes, clip, data 

    channel = "7"
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
                {
                    noteOn: true,
                    timeStamp: 2,
                    noteNumber: '54',
                    velocityNumber: '100'
                },
                {
                    noteOn: true,
                    timeStamp: 3,
                    noteNumber: '53',
                    velocityNumber: '100'
                },
                {
                    noteOn: true,
                    timeStamp: 4,
                    noteNumber: '52',
                    velocityNumber: '100'
                }
            ]
            
    }

    let m = new MidiToVideo(channel,notes,clip,data)
    let result = m.generateChannelSliceCommands()

    let appDirectory = m.app_root

    expect(result[0]).toBe(`ffmpeg -i ${appDirectory}/assets/video_bank/beethoven.mp4 -ss 213 -t 2 -async 1 -y ${appDirectory}/midi_slices/channel_7/1.mp4`)

})

// `ffmpeg -i ${this._app_directory()}` + `/assets/video_bank/${this.video}` + " -ss " + `${channelStartPoints["1"]} -t ${timeTilNext} -async 1 -y ${path.join(this._app_directory())}/midi_slices/channel_1/${startOfNote}.mp4`

