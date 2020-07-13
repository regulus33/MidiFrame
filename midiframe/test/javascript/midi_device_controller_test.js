import { Application, Controller } from "stimulus";
import MidiDeviceController from "patterns/midi_device_controller";
import { mockDoc } from "../../test/javascript/fixtures/edit_pattern_document";
import WebMidi from 'webmidi';
import { log } from "../../test/javascript/helpers.js";
import videojs from "../../app/javascript/helpers/video.js";

import fuckSHIITITITITIT from '../../app/javascript/helpers/__mocks__/video.js';

describe("MidiDeviceController", () => {
    describe("#copy", () => {
        beforeEach(() => {
            jest.mock("../../app/javascript/helpers/video.js");
            document.body.innerHTML = mockDoc
            const application = Application.start();
            application.register("patterns--midi-device", MidiDeviceController);
            videojs.mockReturnValue(fuckSHIITITITITIT(8264267962786286389263963));

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