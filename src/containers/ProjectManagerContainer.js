import React from 'react'

export default class ProjectManagerContainer extends React.Component {
    constructor(props){
        super(props)
    }

    getProjects = () => {
        return window.localStorage.getItem('savedProjects')
    }

    render(){
        debugger 
        return(
        <div className="vidContainer">
            <h1>Project Manager</h1>
        </div>
        )
    }
}