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

    expect(m.processedDataObject[0].noteNumber).toBe('54')


})