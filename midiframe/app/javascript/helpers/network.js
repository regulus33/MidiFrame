import { baseUrl } from "./constants";

export const patternsUrl = (projectId, patternId) => `${baseUrl}/projects/${projectId}/patterns/${patternId}`
export const patternGeneratorUrl = (patternId, projectId) => `${baseUrl}/pattern-generate/${patternId}/${projectId}`
export const autoTuneProjectUrl = (projectId) => `${baseUrl}/autotune/${projectId}`
export const newProjectFromVideoUrl = (videoId) => `${baseUrl}/new-project-from-video/${videoId}`
export const updateProjectWithVideoUrl = (videoId, projectId) => `${baseUrl}/update-project-with-video/${videoId}/${projectId}`
// sends token with ajax request
const headers = () => {
  return { 
    'X-CSRF-Token': document.querySelector("meta[name='csrf-token']")["content"],
    'Content-Type' : 'application/json'
  }
}

export const savePattern = async ({ channel, pianoData, pianoTextData, midiEvents, patternId, projectId, midiType, stepLength }) => {
  // Default options are marked with * 
  console.log(`[NETWORK] about to POST pattern data: channel: ${channel}, pianoData: ${JSON.stringify(pianoData)}, pianoTextData: ${JSON.stringify(pianoTextData)}, midiEvents: ${JSON.stringify(midiEvents)}, patternId: ${patternId}, projectId: ${projectId}`);
  const requestBody = { midiEvents, pianoData, channel, pianoTextData, stepLength };
  if (midiType != undefined) {
    requestBody['midiType'] = midiType
  }
  const response = await fetch(patternsUrl(projectId, patternId), {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(requestBody) // body data type must match "Content-Type" header
  });
  console.log(`[NETWORK] got a response from server, response succeeded?: ${response.ok}`);
}
// tunerArgs == {g: true, gs: false, c: true ...}
// Returns response when done 
export const autotuneProject = async (tunerArgs, projectId, token) => {
  const requestBody = {authenticity_token: token, tuner_args: tunerArgs}
    const response = await fetch(autoTuneProjectUrl(projectId), {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(requestBody) // body data type must match "Content-Type" header
    });
    return response
} 

export const generatePatternClip = ({ patternId, projectId }) => {
  console.log(patternId)
  return fetch(patternGeneratorUrl(patternId, projectId), {
    method: 'POST',
    headers: headers()
  });
}

export const newProjectFromVideo = ({ videoId}) => {
  console.log(videoId)
  return fetch(newProjectFromVideoUrl(videoId), {
    method: 'POST',
    headers: headers()
  });
}

export const editProjectWithVideo = ({ videoId, projectId }) => {
  console.log(videoId)
  return fetch(updateProjectWithVideo(videoId, projectId), {
    method: 'PUT',
    headers: headers()
  });
}
