import { baseUrl } from "../constants";

export const patternsUrl = (projectId, patternId) => `${baseUrl}/projects/${projectId}/patterns/${patternId}`
export const patternGeneratorUrl = (patternId, projectId) => `${baseUrl}/pattern-generate/${patternId}/${projectId}`

export const saveProject = async ({ channel, pianoData, pianoTextData, midiEvents, patternId, projectId }) => {
    return new Promise(() => null);
}

export const generatePatternClip = ({ patternId, projectId }) => {
    return new Promise(() => null);
}