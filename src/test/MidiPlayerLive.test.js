import MidiPlayerLive from '../classes/MidiPlayerLive.js'

it("converts 3:45 style time to a seconds integer", () => {


    expect(MidiPlayerLive.convertMinutesToSeconds("3:34")).toBe(214)

})

it("Plays video at time paired to this channel", () => {

    let midiEvent = {"data":["148","31","100"],"timeStamp":5254.274999955669}
    let state = {
        selectedChannel: "5",
        notes: {    
            31: "3:30",
            32: "3:30",
        }
    }

    MidiPlayerLive.playVideoAtSecondsStart = jest.fn() 
   
    MidiPlayerLive.playNote(148, 31, state.selectedChannel, state.notes)
    expect(MidiPlayerLive.playVideoAtSecondsStart).toHaveBeenCalled()

})


it("doesn't play when a non-number is passsed", () => {

    let midiEvent = {"data":["148","31","100"],"timeStamp":5254.274999955669}
    let state = {
        selectedChannel: "5",
        notes: {    
            31: ":30",
            32: "3:30",
        }
    }

    MidiPlayerLive.playVideoAtSecondsStart = jest.fn() 
   
    MidiPlayerLive.playNote(148, 31, state.selectedChannel, state.notes)
    expect(MidiPlayerLive.playVideoAtSecondsStart).not.toHaveBeenCalled()

})


it("makeSureInputIsNumber() should pass", () => {
    expect(MidiPlayerLive.makeSureInputIsNumber("3:33")).toBe(true)
    expect(MidiPlayerLive.makeSureInputIsNumber(":33")).toBe(false)
    expect(MidiPlayerLive.makeSureInputIsNumber("3:")).toBe(false)
    expect(MidiPlayerLive.makeSureInputIsNumber(":30")).toBe(false)

})




