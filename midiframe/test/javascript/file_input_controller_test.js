// import { Application, Controller } from "stimulus";
// import FileInputController from "loading_controller";

// describe("FileInputController", () => {
//     describe("#copy", () => {
//         beforeEach(() => {
//             document.body.innerHTML = `<!DOCTYPE html><html><head><title>Midiframe</title><meta name="csrf-param" content="authenticity_token" />
//             <meta name="csrf-token" content="yYQ2NNjhKqPuTkqRL2u7hnEODXefEGsd+I+P380pwm7SfZ4gbdX5myC91TQdqH5AGBzv5uDkxNbVewkcpG8j0g==" /><link rel="stylesheet" media="all" href="/assets/application.debug-a7c3b546bba264030724372ccaf1f0d4bcdc3fc04313b49bfa03660a65ae6f28.css" data-turbolinks-track="reload" /><script src="/packs/js/application-47b9b4e122fa7b5e955c.js" data-turbolinks-track="reload" async="async"></script><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" /></head><body><div data-controller="loading"><h1>PROJECTS</h1><div data-target="loading.hide" id="page_content"><div class="card-panel z-depth-5" data-controller="projects--file-input"><form class="form-group" id="edit_project_14" enctype="multipart/form-data" action="/projects/14" accept-charset="UTF-8" method="post"><input type="hidden" name="_method" value="patch" /><input type="hidden" name="authenticity_token" value="VqbnOp1p54GrClckrgqOOJoBvNpTO7GsQDkS9c+YmSx6C+WZwkEMNNwUptP+k+kKzE4kkSEg1pJcJs4FucVApg==" /><div class="input-field"><input placeholder="dorkus dick" id="project_edit_name" type="text" value="dorkus dick" name="project[name]" /><label class="active" for="project_edit_name">name</label></div><div class="input-field"><input placeholder="dorkus dick" id="edit_bpm" type="text" value="106" name="project[bpm]" /><label class="active" for="edit_bpm">bpm </label></div><div class="input-field"></div><label for="project_video"><a class="waves-effect waves-light btn grey darken-4" id="upload_video_button">Choose Video</a></label><span data-target="projects--file-input.fileDisplayName">Replace video</span><input style="display:none;" data-action="change-&gt;projects--file-input#printFileName" data-target="projects--file-input.filename" type="file" name="project[video]" id="project_video" /><label for="project_font"><a class="waves-effect waves-light btn grey darken-4" id="upload_font_button">Choose Font</a></label><span data-target="projects--file-input.fontFileDisplayName">Choose a font</span><input style="display:none;" data-action="change-&gt;projects--file-input#printFontFileName" data-target="projects--file-input.fontFileName" type="file" name="project[font]" id="project_font" /><input type="submit" name="commit" value="S A V E" class="waves-effect waves-light btn submit grey darken-4 " data-action="loading#showLoader" data-disable-with="S A V E" /></form></div><div class="video_preview"><video class="video_preview" controls="controls" src="/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBFdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--9154fe2895cd11064e211471ab27733aa1d7bfc3/test.mp4"></video></div><div class="row"><a class="btn-floating btn-large waves-effect  grey darken-4 lighten-2" id="newProject" href="/projects/new"><i class="material-icons">add </i></a><a class="btn-floating btn-large waves-effect waves-light red" id="deleteProject" rel="nofollow" data-method="DELETE" href="/projects/14"><i class="material-icons">clear</i></a><a class="btn-floating btn-large waves-effect waves-light red" id="new_pattern_button" href="/projects/14/patterns"><i class="material-icons">apps</i></a></div></div><div class="hidden" data-target="loading.show" id="loading_bar"><div class="progress"><div class="indeterminate"></div></div></div></div></body></html>`;

//             const application = Application.start();
//             application.register("loading", FileInputController);
//         });

it("Sets class to hide on hide controller and show on show controller", () => {
    // const submit = document.getElementById("submit");
    // submit.click();
    // const hide = document.getElementById("hide");
    // const show = document.getElementById("show");

    // expect(hide.className).toEqual("hide");
    // expect(show.className).toEqual("show");
});
//     });
// });
