import { Application } from "stimulus";
import MidiDeviceController from "controllers/patterns/midi_device_controller";
import { mockDoc } from "./fixtures/edit_pattern_document.js";
import WebMidi from 'webmidi';
import { log } from "./helpers.js";




describe("MidiDeviceController", () => {
    describe("#copy", () => {
        beforeEach(() => {

            jest.mock("helpers/video.js", () => {
                return jest.fn().mockImplementation((id) => {
                    return {
                        duration: () => 1000000,
                        play: jest.fn
                    }
                })
            })

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

        it("Clicking randomize one should randomize selected input", () => {
            // document.getElementById("save").click();
            log("Clicking a piano key input, C0");
            let key = document.getElementById("0");
            key.click();
            expect(key.classList.contains("black")).not.toBeTruthy()
            log("Clicking the randomize one button, expecting input to have a value");
            document.getElementById("random_one").click();
            log("Value of key after random is:" + key.value);
            expect(key.value).toBeTruthy();
            log("So far so good, now unselecting, expecting input to no longer be selected.");
            key.click();
            expect(key.classList).toEqual(
                expect.arrayContaining(["black"]),
            );
        });
    });
});