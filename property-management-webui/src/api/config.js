// Determine if running in Codespaces
const isCodespaces = typeof window !== 'undefined' && 
                     window.location.hostname.includes('-3001.') && 
                     window.location.hostname.includes('githubpreview.dev');

// Set the API base URL based on environment
export const API_BASE_URL = isCodespaces
  ? `https://${window.location.hostname.replace('-3001', '-8080')}/api/v1`
  : process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

// export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";
