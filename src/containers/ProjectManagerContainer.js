import React from 'react'

export default class ProjectManagerContainer extends React.Component {
    constructor(props){
        super(props)
        this.saveProject = this.saveProject.bind(this)
    }

    getProjects = () => {
        return window.localStorage.getItem('savedProjects')
    }

    registerKeyInputListeners(){
        document.onkeyup = (event) => {
            if(event.key == "s"){
                this.saveProject()
            }
        }
    }

    saveProject() {
        let title = document.getElementById("projectTitle").value
        if(title != "") {
            this.props.midiCollector.storeMidiDataInLocalStorage(title, window)
        } else {
            this.props.midiCollector.storeMidiDataInLocalStorage(null, window)
        }

    }

    renderSavedProjects(){
        if(window.localStorage.getItem('opz-app')){
            let stringedCollection = window.localStorage.getItem('opz-app')
            return JSON.parse(stringedCollection).map((e)=>{
               return(<li>{e.name}</li>)
            })
        }
    }

    render(){
        return(
        <div className="vidContainer" style={{textAlign: 'center'}}>
            <h1>Project Manager</h1>
            <div className="form" style={{textAlign: 'center'}}>
                <label style={{color:"grey"}}>Project Name &nbsp;</label>
                <input id="projectTitle" type="text"/>
            </div>
            <div>
                <ul>
                    {this.renderSavedProjects()}
                </ul>
            </div>
            <button onClick={this.saveProject}>save</button>
        </div>
        )
    }
}