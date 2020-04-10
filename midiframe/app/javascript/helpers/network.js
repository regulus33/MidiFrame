import { baseUrl } from "./constants";

export const patternsUrl = (projectId, patternId) => `${baseUrl}/projects/${projectId}/patterns/${patternId}`
export const patternGeneratorUrl = (patternId, projectId) => `${baseUrl}/pattern-generate/${projectId}/${patternId}`

export const saveProject = async({channel, pianoData, midiEvents, patternId, projectId}) => {
  // Default options are marked with * 
  const response = await fetch( patternsUrl(projectId, patternId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { midiEvents, pianoData, channel } ) // body data type must match "Content-Type" header
  })
  return await response.json() // parses JSON response into native JavaScript objects
}



export const generatePatternClip = ({patternId, projectId}) => {
 return fetch(patternGeneratorUrl(patternId, projectId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
}