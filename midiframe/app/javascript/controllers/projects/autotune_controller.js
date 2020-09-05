import { Controller } from "stimulus"
import { autotuneProject } from '../../helpers/network';

export default class extends Controller {
    
    static targets = [
        'loading',
        'videoElement'
    ]

    connect() {
        let oldArgs = JSON.parse(
            this.element.getAttribute("data-autotune-args")
        );

        if (oldArgs != null) {
            this.notes = oldArgs
        } else {
            this.notes = {
                f: false,
                fs: false,
                g: false,
                gs: false,
                a: false,
                as: false,
                b: false,
                c: false,
                cs: false,
                d: false,
                ds: false,
                e: false,
            } 
        }
  
        this.token = this.element.getAttribute("data-authenticity-token");
    }

    f(e) {
        console.log(this.notes)
        this.notes.f = !(this.notes.f); 
        e.target.classList.toggle("select");
    }
    fs(e) {
        console.log(this.notes)
        this.notes.fs = !(this.notes.fs); 
        e.target.classList.toggle("select");
    }
    g(e) {
        console.log(this.notes)
        this.notes.g = !(this.notes.g); 
        e.target.classList.toggle("select");
    }
    gs(e) {
        console.log(this.notes)
        this.notes.gs = !(this.notes.gs); 
        e.target.classList.toggle("select");
    }
    a(e) {
        console.log(this.notes)
        this.notes.a = !(this.notes.a); 
        e.target.classList.toggle("select");
    }
    as(e) {
        console.log(this.notes)
        this.notes.as = !(this.notes.as); 
        e.target.classList.toggle("select");
    }
    b(e) {
        console.log(this.notes)
        this.notes.b = !(this.notes.b); 
        e.target.classList.toggle("select");
    }
    c(e) {
        console.log(this.notes)
        this.notes.c = !(this.notes.c); 
        e.target.classList.toggle("select");
    }
    cs(e) {
        console.log(this.notes)
        this.notes.cs = !(this.notes.cs); 
        e.target.classList.toggle("select");
    }
    d(e) {
        console.log(this.notes)
        this.notes.d = !(this.notes.d); 
        e.target.classList.toggle("select");
    }
    ds(e) {
        console.log(this.notes)
        this.notes.ds = !(this.notes.ds); 
        e.target.classList.toggle("select");
    }
    e(e) {
        console.log(this.notes)
        this.notes.e = !(this.notes.e); 
        e.target.classList.toggle("select");
    }

    toggleLoading() {
        this.loadingTarget.classList.toggle("hidden");
        this.videoElementTarget.classList.toggle("hidden");
    }       

    async save() {
        this.toggleLoading();
        await autotuneProject(this.notes, this.element.getAttribute("data-project-id"), this.token);
        this.toggleLoading();
    }   

}