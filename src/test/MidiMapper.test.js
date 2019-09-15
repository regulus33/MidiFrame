import MidiMapper from '../classes/MidiMapper.js'

const fs = require('fs')
const path = require('path');

const getFileASJson = filename => {
    const midiTest = path.join(__dirname, `mock/${filename}`)
    return JSON.parse(fs.readFileSync(midiTest,'utf8'))
}



test('getMidiChannel() returns the channel string from a midi message object', () => {
      let m = new MidiMapper
    
      let oneMidiEvent = getFileASJson('./midi_notes_on_off.json')[0] 

      let result = m.getMidiChannel(oneMidiEvent)
      expect(result).toBe("3")

})

test('getMidiChannel() throws exceptionn when channel not found', () => {
  
    const badEvent = {"data":["1","1","1"]} 
    const m = new MidiMapper
  
    try {

        m.getMidiChannel(badEvent)
      
        
    } catch (e) {

        expect(e.message).toBe("channel data not defined for this event object");
    }

})


test('sortedEventsToChannels() groups all active midi channels from a supplied array of channel data', () => {

    const testDataForChannelSort = getFileASJson('channelTest.json')

    const m = new MidiMapper

    let result = m.sortedEventsToChannels(testDataForChannelSort)

    //sorts correct channels
    expect(result["6"] == undefined).toBe(false)
    expect(result["7"] == undefined).toBe(false)
    expect(result["8"] == undefined).toBe(true)

    expect(result["7"].length).toBe(10)
    expect(result["6"].length).toBe(10)


})

test('determineNoteOnOff() returns true for note ons and false for note offs', () => {
    
    let noteOnEvent = {'data':["148","127","127"]}
    let noteOffEvent = {'data':["128","127","127"]}

    const m = new MidiMapper

    expect(m.determineNoteOnOff(noteOnEvent)).toBe(true)
    expect(m.determineNoteOnOff(noteOffEvent)).toBe(false)

})


test('bakeDataForParsing() generates an object of many channels as keys and values sorted by timestamp with note on / off values', () => {

    const testDataForChannelSort = getFileASJson('sorterTest.json')
    const m = new MidiMapper 
    let result = m.bakeDataForParsing(testDataForChannelSort)

    expect(result["3"][0].noteOn).toBe(true) 
    expect(result["3"][0].timeStamp).toBe(1)
    expect(result["3"][0].noteNumber).toBe("54")

    expect(result["3"][result["3"].length - 1].timeStamp).toBe(90000000)

})

test("determineUsedNotes() returns a json of all channels used by each note", () => {

    const testDataForChannelSort = getFileASJson('consistent_midi_track3_opz.json')
    const m = new MidiMapper

    expect(m.determineUsedNotes(testDataForChannelSort)['59']).toEqual(["5", "6"])
})






