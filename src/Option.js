import React from 'react'


const Option = props => {

    return (
        <option key={props.keyToPass} value={props.value}>{props.displayName}</option>
    )
}


export default Option