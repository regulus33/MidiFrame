import { Controller } from "stimulus";
import { editProjectWithFont } from "../../helpers/network.js"

export default class extends Controller {

  static targets = [
  ];

  connect() {
    // debugger
    this.okayExtensions = [
      "otf", 
      "ttf",
      "svg",
      "eot", 
      "woff",
      "woff2",
    ]
  }

  //replaces font styles
  fontStyle({url, filename}){
    return(`
    @font-face {
      font-family: "${filename}";
      src: url("${url}");
    }

    span#note-text-text {
      font-family: "${filename}";
    }

    .vjs-control-bar {
      z-index: 4000;
    }
    `);
  }

  uploadFont(e){
    const file = e.target.files[0];
    const ext = file.name.split(".").pop();
    if(this.okayExtensions.includes(ext) == false){
      alert("yo this doesn't look like a font file brah...");
    }
    const project = this.element.getAttribute("data-font-uploader-project");
    editProjectWithFont({projectId:project, fontFile: file}).then((response)=>{
      response.json().then((json)=>{
        document.getElementById("font-styles").innerHTML = this.fontStyle({url: json.newFontUrl, filename: json.newFontFamily})
      });
    })
  }

}


