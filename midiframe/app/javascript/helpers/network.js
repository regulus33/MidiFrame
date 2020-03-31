import { baseUrl } from "./constants";

export const patternsUrl = (projectId, patternId) => `${baseUrl}/projects/${projectId}/patterns/${patternId}`

export const saveProject = async({data, patternId, projectId}) => {
  // Default options are marked with *
  const response = await fetch( patternsUrl(projectId, patternId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( data ) // body data type must match "Content-Type" header
  })
  return await response.json() // parses JSON response into native JavaScript objects
}



