// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
//CUSTOM 
require("../projects.js")
//ALL REUSABLE FUNCTIONS IMPORTED HERE
const {
    show_loader_when_submit_form, 
} = require("../shared.js")
import "../stylesheets/application"
import 'materialize-css/dist/js/materialize'

document.addEventListener("turbolinks:load", () => {
    //todo, is this where I'm supposed to put something?
    if( document.getElementsByTagName("form").length) {
        show_loader_when_submit_form(document.getElementsByTagName("form")[0])
    }
})

//for globally shared functions we need to register these appwide functions 
// window.addEventListener('load', (event) => {

 

// });
//SUBMIT VIDEO FORM AND DISPLAY A LOADING BAR 
//we can also put global functions in here 


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
// Support component names relative to this directory:

