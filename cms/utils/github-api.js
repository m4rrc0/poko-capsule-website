// GitHub API utilities for frontend use

// Store and retrieve GitHub access token from localStorage
export const getAccessToken = () => {
  return localStorage.getItem('github_access_token');
};

export const setAccessToken = (token) => {
  localStorage.setItem('github_access_token', token);
};

export const clearAccessToken = () => {
  localStorage.removeItem('github_access_token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Base GitHub API request function
export const githubRequest = async (endpoint, options = {}) => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('No GitHub access token available');
  }
  
  const defaultOptions = {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `GitHub API error: ${response.status}`);
  }
  
  return response.json();
};

// GitHub API operations
export const getUserInfo = () => githubRequest('/user');

export const getRepositories = () => githubRequest('/user/repos?sort=updated&per_page=100');

export const getOrganizations = () => githubRequest('/user/orgs');

// Get forks of a specific repository
export const getRepoForks = (owner, repo) => githubRequest(`/repos/${owner}/${repo}/forks?per_page=100`);

// Get detailed information about a repository including fork relationships
export const getRepoDetails = (owner, repo) => githubRequest(`/repos/${owner}/${repo}`);

export const forkRepository = (owner, repo, params = {}) => {
  const endpoint = `/repos/${owner}/${repo}/forks`;
  
  // Extract parameters with defaults
  const { 
    organization, 
    name, 
    default_branch_only = false
  } = params;
  
  // Build the request body with only non-undefined values
  const requestBody = {};
  
  if (organization) requestBody.organization = organization;
  if (name) requestBody.name = name;
  if (default_branch_only !== undefined) requestBody.default_branch_only = default_branch_only;
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  // Only add body if we have parameters
  if (Object.keys(requestBody).length > 0) {
    options.body = JSON.stringify(requestBody);
  }
  
  return githubRequest(endpoint, options);
};

// Parse access token from URL hash fragment
export const parseAccessTokenFromHash = () => {
  const hash = window.location.hash;
  if (hash && hash.includes('access_token=')) {
    const token = hash.split('access_token=')[1].split('&')[0];
    // Clear the hash to avoid exposing the token
    window.history.replaceState({}, document.title, window.location.pathname);
    return token;
  }
  return null;
};
