import { Application } from "stimulus";
import MidiDeviceController from "controllers/patterns/midi_device_controller";
import { mockDoc } from "./fixtures/edit_pattern_document.js";
import WebMidi from 'webmidi';
import { log, VideoJsMock } from "./helpers.js";
import video from "../../app/javascript/helpers/video.js";

const mockVideojsInstance = new VideoJsMock();
//return a mocked up class of video js mock 
jest.mock("helpers/video.js", () => {
    return jest.fn().mockImplementation((id) => {
        let isString = (typeof (id) == "string");
        if (!isString) {
            throw "invalid argument to videojs constructor, must be a string, id of video"
        }
        return mockVideojsInstance;
    })
})

const callMidiStart = () => {
    WebMidi.inputs[0].start();
}

const callMidiStop = () => {
    WebMidi.inputs[0].stop();
}

const playMidiNote = (event) => {
    WebMidi.inputs[0].noteon(event);
}

const addTimeStampToMidiNote = (number, time) => {
    mockVideojsInstance.currentTime(time);
    let key = document.getElementById(number);
    key.click();
    document.getElementById("adjust").click();
    // key.click();
}

describe("MidiDeviceController", () => {
    describe("#copy", () => {
        beforeEach(() => {

            document.body.innerHTML = mockDoc
            const application = Application.start();
            application.register("patterns--midi-device", MidiDeviceController);
        });

        it("Should set correct callbacks for WebMidi, device", () => {
            // document.getElementById("save").click();
            ["noteon", "noteoff", "start", "stop", "clock"].forEach((e) => {
                expect(typeof (WebMidi.inputs[0][e])).toBe("function")
            })
        });

        it("randomize one button should randomize selected input", () => {
            // document.getElementById("save").click();
            log("Clicking a piano key input, C0");
            let key = document.getElementById("0");
            let randomimzeOneButton = document.getElementById("random_one");
            key.click();
            expect(randomimzeOneButton.classList.contains("black")).not.toBeTruthy()
            log("Clicking the randomize one button, expecting input to have a value");
            document.getElementById("random_one").click();
            log("Value of key after random is: " + key.value);
            expect(key.value).toBeTruthy();
            log("So far so good, now unselecting, expecting input to no longer be selected and random button to be black again.");
            key.click();
            expect(randomimzeOneButton.classList.contains("black")).toBeTruthy();
        });

        it("Plays the video when you hit play on the OPZ", () => {
            log("Pressing play on an imaginary opz");
            expect(mockVideojsInstance.playing).toBe(false)
            callMidiStart();
            expect(mockVideojsInstance.playing).toBe(true)
            log("Pressing stop on our opz, expecting video to stop");
            callMidiStop();
            expect(mockVideojsInstance.playing).toBe(false);
        });

        it("Jerks to a new timestamp on midi note play", () => {
            let hardCodedInitialMockVideoJSTime = 50;
            log("About to play some, notes, sanity checking that video's current time is 50");

            expect(mockVideojsInstance.currentTime()).toBe(hardCodedInitialMockVideoJSTime);
            log(`changing vide time to 30, now when we play note 60, the video should jump to 30`);
            let videoTime = 30;

            const mockMidiNoteOnEvent = {
                note: {
                    number: 60
                },
                timestamp: videoTime
            }
            addTimeStampToMidiNote(60, 30);

            log("inputed the ote time into the piano key form");



            playMidiNote(mockMidiNoteOnEvent);

        });



    });
});