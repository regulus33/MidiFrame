import { Application, Controller } from "stimulus";
import MidiDeviceController from "patterns/midi_device_controller";
import { mockDoc } from "../../test/javascript/fixtures/edit_pattern_document";
import WebMidi from 'webmidi'

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

        it("Should set correct callbacks for WebMidi, device", () => {
            // document.getElementById("save").click();
            ["noteon", "noteoff", "start", "stop", "clock"].forEach((e) => {
                expect(typeof (WebMidi.inputs[0][e])).toBe("function")
            })
        });
    });
});