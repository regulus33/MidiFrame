import MidiPlayerLive from '../classes/MidiPlayerLive.js'

beforeEach(() => {
     global.document = {
        getElementById: (note) => {
            return {style: {color:'blue'}}
        }
    }
})

it("converts 3:45 style time to a seconds integer", () => {


    expect(MidiPlayerLive.convertMinutesToSeconds("3:34")).toBe(214)

})

it("Plays video at time paired to this channel", () => {
    Object.defineProperty(
        global.document, 'getElementById', { 
            value: ()=>{
                return {
                    style: {color: 'blue'
                } 
            } 
            }
        }
    )
   


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

it("sanitize() should pass", () => {
    const expected = ""
    expect(MidiPlayerLive.sanitize("3:33")).toBe("3:33")
    expect(MidiPlayerLive.sanitize(":33")).toBe(expected)
    expect(MidiPlayerLive.sanitize("3:")).toBe(expected)
    expect(MidiPlayerLive.sanitize(":30")).toBe(expected)
})

it("randomTimeWithinThisSpan() should pass", () => {
    const expected = 1
    expect(MidiPlayerLive.randomTimeWithinThisSpan(234).split(".").length).toBe(expected)
    expect(MidiPlayerLive.randomTimeWithinThisSpan(235.555).split(".").length).toBe(expected)
    expect(MidiPlayerLive.randomTimeWithinThisSpan(234.00006).split(".").length).toBe(expected)
    expect(MidiPlayerLive.randomTimeWithinThisSpan(222.3446642222244556).split(".").length).toBe(expected)

})




