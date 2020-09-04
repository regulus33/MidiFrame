import { baseUrl } from "./constants";

export const patternsUrl = (projectId, patternId) => `${baseUrl}/projects/${projectId}/patterns/${patternId}`
export const patternGeneratorUrl = (patternId, projectId) => `${baseUrl}/pattern-generate/${patternId}/${projectId}`
export const autoTuneProjectUrl = (projectId) => `${baseUrl}/autotune/${projectId}`

export const saveProject = async ({ channel, pianoData, pianoTextData, midiEvents, patternId, projectId, midiType }) => {
  // Default options are marked with * 
  console.log(`[NETWORK] about to POST pattern data: channel: ${channel}, pianoData: ${JSON.stringify(pianoData)}, pianoTextData: ${JSON.stringify(pianoTextData)}, midiEvents: ${JSON.stringify(midiEvents)}, patternId: ${patternId}, projectId: ${projectId}`);
  const requestBody = { midiEvents, pianoData, channel, pianoTextData };
  if (midiType != undefined) {
    requestBody['midiType'] = midiType
  }
  const response = await fetch(patternsUrl(projectId, patternId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody) // body data type must match "Content-Type" header
  });
  console.log(`[NETWORK] got a response from server, response succeeded?: ${response.ok}`);
}
// tunerArgs == {g: true, gs: false, c: true ...}
export const autotuneProject = async (tunerArgs, projectId, token) => {
  const requestBody = {authenticity_token: token, tuner_args: tunerArgs}
    const response = await fetch(autoTuneProjectUrl(projectId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody) // body data type must match "Content-Type" header
  });
} 

export const generatePatternClip = ({ patternId, projectId }) => {
  console.log(patternId)
  return fetch(patternGeneratorUrl(patternId, projectId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
}