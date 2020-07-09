import { Application, Controller } from "stimulus";
import LoadingController from "loading_controller";

describe("LoadingController", () => {
    describe("#copy", () => {
        beforeEach(() => {
            document.body.innerHTML = `<div data-controller="loading">
        <div id="hide" data-target="loading.hide" />
        <div id="show" data-target="loading.show" />
        <a id="submit" data-action="loading#showLoader"></a>
      </div>`;

            const application = Application.start();
            application.register("loading", LoadingController);
        });

        it("Sets class to hide on hide controller and show on show controller", () => {
            const submit = document.getElementById("submit");
            submit.click();
            const hide = document.getElementById("hide");
            const show = document.getElementById("show");

            expect(hide.className).toEqual("hide");
            expect(show.className).toEqual("show");
        });
    });
});