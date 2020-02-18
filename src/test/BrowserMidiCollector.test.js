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
    b.onMidiMessageJamming(mockMessage)

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
    b.onMidiMessageJamming(mockMessage)

    expect(MidiPlayerLive.playNote).not.toHaveBeenCalled()
})


it("handles the first midi note to help the rest of the app know which channel is default", () => {
    const b = new BrowserMidiCollector()
    let mockMessage = {
        data: [147,38,120],
        timeStamp: 333.4444
    }
    b.onMidiMessageJamming(mockMessage)

    expect(b.activeChannel).toBe("4")
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
    b.onMidiMessageRecording(mockMessage)
    b.onMidiMessageRecording(mockMessage2)
    

})


it("updateNotesForTimestampOnly() should pass", () => {
    const b = new BrowserMidiCollector()
    let notes = {67: "1:03", 69: "", 72: "", 76: "", 79: ""} 
    b.activeChannel = "5"
    b.updateNotesForTimestampOnly(notes)
    expect(b.midiData["5"]["notes"]).toEqual(notes)
})

it("formatMidiDataForStorage() should pass", () => {

    window.getItem = jest.fn() 
    window.setItem = jest.fn() 

    const b = new BrowserMidiCollector()
    
    b.midiData = {
        "1":{notes: [1,2,3], videoPath: "path.mp4"},
        "2":{notes: [1,2,3], videoPath: "path.mp4"},
        "3":{notes: [1,2,3], videoPath: "path.mp4"},
        "4":{notes: [1,2,3], videoPath: "path.mp4"},
        "5":{notes: [1,2,3], videoPath: "path.mp4"},
        "6":{notes: [1,2,3], videoPath: "path.mp4"},
        "7":{notes: [1,2,3], videoPath: "path.mp4"},
        "8":{notes: [1,2,3], videoPath: "path.mp4"},
        "9":{notes: [1,2,3], videoPath: "path.mp4"},
        "10":{notes: [1,2,3], videoPath: "path.mp4"}
    }

    expect(b.formatMidiDataForStorage()["data"]).toEqual(b.midiData)
    expect(typeof(b.formatMidiDataForStorage()["name"])).toBe("number")

})

it("storeMidiDataInLocalStorage() stores midiData in local storage when no pre existing data", () => {
    let mockWindow = {
        localStorage: {
            getItem: jest.fn(),
            setItem: jest.fn(),
        }
    }



    const b = new BrowserMidiCollector()
    
    b.midiData = {
        "1":{notes: [1,2,3], videoPath: "path.mp4"},
        "2":{notes: [1,2,3], videoPath: "path.mp4"},
        "3":{notes: [1,2,3], videoPath: "path.mp4"},
        "4":{notes: [1,2,3], videoPath: "path.mp4"},
        "5":{notes: [1,2,3], videoPath: "path.mp4"},
        "6":{notes: [1,2,3], videoPath: "path.mp4"},
        "7":{notes: [1,2,3], videoPath: "path.mp4"},
        "8":{notes: [1,2,3], videoPath: "path.mp4"},
        "9":{notes: [1,2,3], videoPath: "path.mp4"},
        "10":{notes: [1,2,3], videoPath: "path.mp4"}
    }

    let firstArgument = b.formatMidiDataForStorage("fpoon")
    b.storeMidiDataInLocalStorage("fpoon", mockWindow)

    expect(mockWindow.localStorage.setItem).toHaveBeenLastCalledWith('opz-app', JSON.stringify([firstArgument]))


    


    

})


it("storeMidiDataInLocalStorage() stores midiData plus old data in local storage is local storage exists for this user", () => {
    let mockWindow = {
        localStorage: {
            getItem: jest.fn(),
            setItem: jest.fn(),
        }
    }



    const b = new BrowserMidiCollector()
    
    b.midiData = {
        "1":{notes: [1,2,3], videoPath: "path.mp4"},
        "2":{notes: [1,2,3], videoPath: "path.mp4"},
        "3":{notes: [1,2,3], videoPath: "path.mp4"},
        "4":{notes: [1,2,3], videoPath: "path.mp4"},
        "5":{notes: [1,2,3], videoPath: "path.mp4"},
        "6":{notes: [1,2,3], videoPath: "path.mp4"},
        "7":{notes: [1,2,3], videoPath: "path.mp4"},
        "8":{notes: [1,2,3], videoPath: "path.mp4"},
        "9":{notes: [1,2,3], videoPath: "path.mp4"},
        "10":{notes: [1,2,3], videoPath: "path.mp4"}
    }

    let mockReturnOfGetItem = [b.formatMidiDataForStorage(),b.formatMidiDataForStorage(),b.formatMidiDataForStorage(),b.formatMidiDataForStorage(),b.formatMidiDataForStorage(),b.formatMidiDataForStorage()]
    mockWindow.localStorage.getItem.mockReturnValue(JSON.stringify(mockReturnOfGetItem))
    mockReturnOfGetItem.push(b.formatMidiDataForStorage("fpoon"))
    let expectedSecondArg = mockReturnOfGetItem

    b.storeMidiDataInLocalStorage("fpoon", mockWindow)

    expect(mockWindow.localStorage.setItem).toHaveBeenLastCalledWith('opz-app',JSON.stringify(expectedSecondArg) )

})

//AcTUALLY FIX THIS 
// it("deleteMidiDataFromLocalStorage(), pass", () => {
//     let mockWindow = {
//         localStorage: {
//             removeItem: jest.fn(),
//             getItem: jest.fn(),
//             setItem: jest.fn()
//         }
//     }




//     const b = new BrowserMidiCollector()
    
//     b.midiData = {
//         "1":{notes: [1,2,3], videoPath: "path.mp4"},
//         "2":{notes: [1,2,3], videoPath: "path.mp4"},
//         "3":{notes: [1,2,3], videoPath: "path.mp4"},
//         "4":{notes: [1,2,3], videoPath: "path.mp4"},
//         "5":{notes: [1,2,3], videoPath: "path.mp4"},
//         "6":{notes: [1,2,3], videoPath: "path.mp4"},
//         "7":{notes: [1,2,3], videoPath: "path.mp4"},
//         "8":{notes: [1,2,3], videoPath: "path.mp4"},
//         "9":{notes: [1,2,3], videoPath: "path.mp4"},
//         "10":{notes: [1,2,3], videoPath: "path.mp4"}
//     }

//     let mockReturnOfGetItem = [b.formatMidiDataForStorage(),b.formatMidiDataForStorage(),b.formatMidiDataForStorage(),b.formatMidiDataForStorage(),b.formatMidiDataForStorage(),b.formatMidiDataForStorage()]

//     mockWindow.localStorage.removeItem.mockReturnValue(JSON.stringify(mockReturnOfGetItem))
//     mockReturnOfGetItem.push(b.formatMidiDataForStorage("fpoon"))
//     let expectedSecondArg = mockReturnOfGetItem

//     b.storeMidiDataInLocalStorage("fpoon", mockWindow)

//     expect(mockWindow.localStorage.setItem).toHaveBeenLastCalledWith('opz-app',JSON.stringify(expectedSecondArg) )

// })


it("Saves mididata that was loaded ", () => {
    let mockWindow = {
        localStorage: {
            getItem: jest.fn(),
            setItem: jest.fn(),
        }
    }



    const b = new BrowserMidiCollector()
    
    b.midiData = {
        "1":{notes: [1,2,3], videoPath: "path.mp4"},
        "2":{notes: [1,2,3], videoPath: "path.mp4"},
        "3":{notes: [1,2,3], videoPath: "path.mp4"},
        "4":{notes: [1,2,3], videoPath: "path.mp4"},
        "5":{notes: [1,2,3], videoPath: "path.mp4"},
        "6":{notes: [1,2,3], videoPath: "path.mp4"},
        "7":{notes: [1,2,3], videoPath: "path.mp4"},
        "8":{notes: [1,2,3], videoPath: "path.mp4"},
        "9":{notes: [1,2,3], videoPath: "path.mp4"},
        "10":{notes: [1,2,3], videoPath: "path.mp4"}
    }

    let mockReturnOfGetItem = [b.formatMidiDataForStorage(),b.formatMidiDataForStorage(),b.formatMidiDataForStorage(),
        
    b.formatMidiDataForStorage(),b.formatMidiDataForStorage(),b.formatMidiDataForStorage()]
    
    mockWindow.localStorage.getItem.mockReturnValue(JSON.stringify(mockReturnOfGetItem))
    
    mockReturnOfGetItem.push(b.formatMidiDataForStorage("fpoon"))
    
    let expectedSecondArg = mockReturnOfGetItem

    b.storeMidiDataInLocalStorage("fpoon", mockWindow)

    expect(mockWindow.localStorage.setItem).toHaveBeenLastCalledWith('opz-app',JSON.stringify(expectedSecondArg) )

   
})

test("data parser narrows down a midi message into its useable parts",()=>{

    let bmc = new BrowserMidiCollector()
   let event =  {
        randomAttribute: "randValue",
         data: [123,123,123],
         timeStamp: 123.123
    }
    expect(bmc.processEvent(event).data).toEqual(event.data)
    expect(bmc.processEvent(event).randomAttribute).toBe(undefined)

})



test("Update clip duration setter",()=>{

    let bmc = new BrowserMidiCollector()
    bmc.updatePatternDuration(2.33)
    expect(bmc.clipLength).toBe(2.33)

})


test("grabs duration of initial note from beginning of recording", () => {

    let bmc = new BrowserMidiCollector() 
    let mockPlayMessage = {
        data: [
            250,
            32,
            120
        ],
        timeStamp:333.3445
    }
    let mockNote = {
        data: ["147",32,120],
        timeStamp: 333.4444
    }
    let mockNote2 = {
        data: ["147",32,120],
        timeStamp: 334.5444
    }
    const mockOnNoteRecordedToAvoidErrorz =  (arg) => {}
    bmc.onNoteRecorded = mockOnNoteRecordedToAvoidErrorz
    bmc.activeChannelChange("4")
    bmc.recording = true 
    bmc.onMidiMessageRecording(mockPlayMessage)
    bmc.onMidiMessageRecording(mockNote)
    bmc.onMidiMessageRecording(mockNote2)
    expect(bmc.idlePeriodDuration()).toBeGreaterThan(0)
})


