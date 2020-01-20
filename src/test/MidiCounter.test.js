import MidiCounter from '../classes/MidiCounter.js'


test('Calculates beats in any group of bars', () => {
    let bars = 1 
    let length = MidiCounter.getLength(bars)
    expect(length).toBe(96)
})

test('Calculates length in seconds when supplied with bars and bpm', () => {
    let bars = 1 
    let bpm = 120 
    let length = MidiCounter.getLengthInSecondsOfClip(bars,bpm)
    expect(length).toBe(2)
})


