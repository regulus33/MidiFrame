import { patternsUrl } from "./constants";

export async const saveProject = (data = {}) => {
  // Default options are marked with *
  const response = await fetch(patternsUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}



