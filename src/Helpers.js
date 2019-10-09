export const reverseChannelsAndNotesObject = (obj) => {
    let collectedChannels = []
    Object.keys(obj).forEach(function(key) {

        console.log(key, obj[key]);

        obj[key].forEach(el =>{
            collectedChannels.push(el)
        })
      
    })
    //uniq 
    let uniqChans = Array.from(new Set(collectedChannels))

    let newObject = {}

    uniqChans.forEach(el=>{
        newObject[el] = []
    })

    uniqChans.forEach(channy => {
        Object.keys(obj).forEach(function(key) {
            if(obj[key].includes(channy) ){
                newObject[channy].push(Number(key))
            }
        })
    })

    return newObject
}

export const mergeArrays = (arrayOfArrays) => {
    let flattenedArray = []
    arrayOfArrays.forEach(el => {
        el.forEach(l =>{
            flattenedArray.push(l)
        })
    })
    return flattenedArray
}

export const getNotesFromChannelInSuppliedObject = (channelsToNotes, selectedChannel) => {
    if(channelsToNotes[selectedChannel] == undefined) { 
        return []
    }else {
        return channelsToNotes[selectedChannel]
    }
}
    
