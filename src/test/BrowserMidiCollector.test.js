import BrowserMidiCollector from '../classes/BrowserMidiCollector'
import MidiPlayerLive from '../classes/MidiPlayerLive';



it("converts a raw midi.js event to a parceable, meaningfull object", () => {
    let singleEvent = {"data":["149","60","100"],"timeStamp":5502.5799999712035}
    const b = new BrowserMidiCollector()
    let result = b.translateForeignMidiEvent(singleEvent)
    expect(result).toEqual({
        channel: "6", 
        noteNumber: "60",
    })
})

it("Does not touch midi off notes", () => {
    let singleEvent = {"data":["128","60","100"],"timeStamp":5502.5799999712035}
    const b = new BrowserMidiCollector()
    let result = b.translateForeignMidiEvent(singleEvent)
    expect(result).toEqual(null)
})

it("updateState() preserves state accross changes to the video selector's state", () => {
    let pretendState = {
    videoFiles:['thePath.mp4'], 
    selectedVideoPath: "thePath.mp4", 
    selectedChannel: "1", 
    notes:{
        53: "3:45",
        54: "",
        56: "",
        57: "",
        58: "",
        60: "",
        67: ""
    }, 
    latestCapturedMidi:[
            {
                "data":["148","31","100"],
                "timeStamp":5254.274999955669
            }
        ]
    }

    let midiCollector = new BrowserMidiCollector()
    let mockedState = {}
    mockedState.selectedChannel = "6"
    mockedState.videoPath = "35InaMillion.mpeg"
    mockedState.notes = pretendState.notes
    midiCollector.updateState(mockedState)

    expect(midiCollector.midiData["6"].notes[53]).toBe("3:45")

    mockedState.selectedChannel = "8"
    mockedState.videoPath = "1manpuddleeee.mpeg"

    midiCollector.updateState(mockedState)

    expect(midiCollector.midiData["6"].notes[53]).toBe("3:45")
    expect(midiCollector.midiData["8"].notes[53]).toBe("3:45")



    
})

it("Updates active channel",() => {
    const b = new BrowserMidiCollector()
    b.activeChannelChange("4")
    expect(b.activeChannel).toBe("4") 
})


it("calls playNote if it knows this note",() => {
    const b = new BrowserMidiCollector()
    b.activeChannelChange("4")
    b.updateState({selectedChannel:"4",notes:{32:""},videPath:"/path"})
    MidiPlayerLive.playNote = jest.fn() 
    let mockMessage = {
        data: [147,32,120],
        timeStamp: 333.4444
    }
    b.onMidiMessage(mockMessage)

    expect(MidiPlayerLive.playNote).toHaveBeenCalled()
})

it("Does not get undefined errors if channel is not yet populated with notes object",() => {
    const b = new BrowserMidiCollector()
    b.activeChannelChange("4")
    MidiPlayerLive.playNote = jest.fn() 
    let mockMessage = {
        data: [147,38,120],
        timeStamp: 333.4444
    }
    b.onMidiMessage(mockMessage)

    expect(MidiPlayerLive.playNote).not.toHaveBeenCalled()
})

it("Does not call play note if this note is not recorded in the midiData",() => {
    const b = new BrowserMidiCollector()
    b.activeChannelChange("4")
    b.updateState({selectedChannel:"4",notes:{32:""},videPath:"/path"})
    MidiPlayerLive.playNote = jest.fn() 
    let mockMessage = {
        data: [147,38,120],
        timeStamp: 333.4444
    }
    b.onMidiMessage(mockMessage)

    expect(MidiPlayerLive.playNote).not.toHaveBeenCalled()
})


it("Skips if active channel not picked yet.",() => {
    const b = new BrowserMidiCollector()
    b.updateState({selectedChannel:"4",notes:{32:""},videPath:"/path"})
    MidiPlayerLive.playNote = jest.fn() 
    let mockMessage = {
        data: [147,38,120],
        timeStamp: 333.4444
    }
    b.onMidiMessage(mockMessage)

    expect(MidiPlayerLive.playNote).not.toHaveBeenCalled()
})

it("handles the first midi note to help the rest of the app know which channel is default", () => {
    const b = new BrowserMidiCollector()
    let mockMessage = {
        data: [147,38,120],
        timeStamp: 333.4444
    }
    b.onMidiMessage(mockMessage)

    expect(b.activeChannel).toBe("4")
})

it("notesAndChannels Has a field where notes are stored to determine used notes", () => {
    const b = new BrowserMidiCollector()
    let mockMessage = {
        data: [146,38,120],
        timeStamp: 333.4444
    }

    b.onMidiMessageA(mockMessage)

    expect(b.notesAndChannels["3"].has(38)).toBe(true)
})

it("notesAndChannels doesnt save dup notes", () => {
    const b = new BrowserMidiCollector()
    let mockMessage = {
        data: [146,38,120],
        timeStamp: 333.4444
    }

    b.onMidiMessageA(mockMessage)
    b.onMidiMessageA(mockMessage)
    b.onMidiMessageA(mockMessage)

    expect(b.notesAndChannels["3"].size).toBe(1)
})

it("notesAndChannels doesnt save dup notes", () => {
    const b = new BrowserMidiCollector()
    let mockMessage = {
        data: [146,38,120],
        timeStamp: 333.4444
    }

    b.onMidiMessageA(mockMessage)
    b.onMidiMessageA(mockMessage)
    b.onMidiMessageA(mockMessage)

    expect(b.notesAndChannels["3"].size).toBe(1)
})

it("onMidiMessageA sets received receivedanymidiYet to true when first midi received on the instance", ()=>{
    const b = new BrowserMidiCollector()
    let mockMessage = {
        data: [146,38,120],
        timeStamp: 333.4444
    }

    b.onMidiMessageA(mockMessage)

    expect(b.receivedAnyMessageYet).toBe(true)

})

it("Has a getter for notesAndChannels() that squashes empty sets for the forms in videoselctorcontainer", ()=>{
    const b = new BrowserMidiCollector()
    let mockMessage = {
        data: [146,38,120],
        timeStamp: 333.4444
    }
    let mockMessage2 = {
        data: [148,33,120],
        timeStamp: 333.4444
    }
//3 and 5 
    b.onMidiMessageA(mockMessage)
    b.onMidiMessageA(mockMessage2)

    expect(b.getNotesAndChannels()["3"]).toEqual([38])
    expect(b.getNotesAndChannels()["5"]).toEqual([33])
    expect(b.getNotesAndChannels()["9"]).toBe(undefined)

})

it("Has notes in notes object at the appropriate time", () => {
    const b = new BrowserMidiCollector()
    let mockMessage = {
        data: [146,38,120],
        timeStamp: 333.4444
    }
    let mockMessage2 = {
        data: [148,33,120],
        timeStamp: 333.4444
    }
//3 and 5 
    b.onMidiMessageA(mockMessage)
    b.onMidiMessageA(mockMessage2)
    

})