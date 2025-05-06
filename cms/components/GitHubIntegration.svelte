<script>
  // Import state variables and setters
  import { authState } from '../utils/state.svelte.js';
  
  // Import GitHub API utilities
  import { 
    githubRequest,
    getAccessToken,
    setAccessToken, 
    clearAccessToken,
    parseAccessTokenFromHash,
    getUserInfo,
    getRepositories,
    getOrganizations,
    getRepoDetails,
    forkRepository
  } from '../utils/github-api.js';
  
  // Form state
  // Pre-filled with target repo info
  let repoName = $state('poko-capsule-website');
  let selectedOrg = $state('');
  let defaultBranchOnly = $state(false);
  let forkResult = $state('');
  
  // OAuth parameters
  const githubAppUri = import.meta.env.PUBLIC_POKO_GITHUB_APP_URI;
  const githubClientId = import.meta.env.PUBLIC_POKO_GITHUB_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/github-auth-callback`;
  const scope = 'repo,admin:org,admin:org_hook,admin:repo_hook,admin:enterprise,admin:public_key,admin:gpg_key,admin:app';
  
  // All GitHub API functions are now imported from '../utils/github-api.js'
  
  // Initialize authentication
  const initAuth = async () => {
    const token = parseAccessTokenFromHash();
    if (token) {
      setAccessToken(token);
    }
    
    if (getAccessToken()) {
      authState.isAuthenticated = true;
      await loadUserData();
    }
  };
  
  // Load user data and repositories
  const loadUserData = async () => {
    try {
      authState.isLoading = true;
      authState.errorMessage = '';
      
      // Get user info
      const userData = await getUserInfo();
      authState.user = userData;
      
      // Get all repositories first
      const repoData = await getRepositories();
      
      // Define target repository information
      const targetOwner = 'm4rrc0';
      const targetRepo = 'poko-capsule-website';
      const targetFullName = `${targetOwner}/${targetRepo}`;

      // First try to find the original repository in the user's repositories
      let pokoRepo = repoData.find(repo => repo.full_name === targetFullName);
      
      // Get all repos that look like they might be forks (including repos where fork === true)
      const potentialPokoRepos = repoData.filter(repo => {
        // Direct match with name
        if (repo.name === targetRepo) return true;
        
        // Known fork
        if (repo.fork) return true;
        
        // Has source property that matches
        if (repo.source && repo.source.full_name === targetFullName) return true;
        
        // Contains 'poko-capsule' in the name as a fallback
        return repo.name.includes('poko-capsule');
      });
      
      // If no related repos found, show an empty list
      if (potentialPokoRepos.length === 0) {
        authState.repositories = [];
        return;
      }

      // For each potential repo, get its details to confirm fork relationship
      const confirmedPokoRepos = [];
      
      for (const repo of potentialPokoRepos) {
        try {
          // If this is the original repo, add it directly
          if (repo.full_name === targetFullName) {
            confirmedPokoRepos.push(repo);
            continue;
          }
          
          // For forks, try to get detailed information
          if (repo.fork) {
            const details = await getRepoDetails(repo.owner.login, repo.name);
            
            // Check if this is directly forked from the target or indirectly through the source/parent
            if (details.source && details.source.full_name === targetFullName) {
              confirmedPokoRepos.push(repo);
            } else if (details.parent && details.parent.full_name === targetFullName) {
              confirmedPokoRepos.push(repo);
            }
          } else {
            // Still include repos with the name if not a confirmed fork
            if (repo.name === targetRepo || repo.name.includes('poko-capsule')) {
              confirmedPokoRepos.push(repo);
            }
          }
        } catch (error) {
          console.error(`Error getting details for repo ${repo.full_name}:`, error);
          // Include the repo anyway if we can't get details
          confirmedPokoRepos.push(repo);
        }
      }
      
      // Update state with confirmed repositories
      authState.repositories = confirmedPokoRepos;
      
      // Get organizations
      const orgsData = await getOrganizations();
      authState.organizations = orgsData;
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      authState.errorMessage = errorMsg;
      
      // If we get an authentication error, clear the token
      if (typeof errorMsg === 'string' && 
          (errorMsg.includes('No GitHub access token') || 
           errorMsg.includes('Bad credentials'))) {
        logout();
      }
    } finally {
      authState.isLoading = false;
    }
  };
  
  // Login with GitHub
  const login = () => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };
  
  // Logout
  const logout = () => {
    clearAccessToken();
    authState.isAuthenticated = false;
    authState.user = { login: null };
    authState.repositories = [];
    authState.organizations = [];
  };
  
  // Handle fork form submission
  const handleForkSubmit = async (event) => {
    event.preventDefault();
    
    // Always use m4rrc0/poko-capsule-website as the target repo
    const targetOwner = 'm4rrc0';
    const targetRepoName = 'poko-capsule-website';
    
    if (!repoName) {
      forkResult = '<p class="error">Repository name is required</p>';
      return;
    }
    
    forkResult = '<p>Forking repository...</p>';
    authState.isLoading = true;
    
    try {
      // Build fork parameters object with only supported parameters
      const forkParams = {
        name: repoName,
        default_branch_only: defaultBranchOnly
      };
      
      // Add organization if selected
      if (selectedOrg) {
        forkParams.organization = selectedOrg;
      }
      
      // Call the fork API
      const result = await forkRepository(targetOwner, targetRepoName, forkParams);
      
      forkResult = `<p>Repository forked successfully!</p>
                    <p><a href="${result.html_url}" target="_blank" rel="noopener">View forked repo</a></p>`;
      
      // Clear the form for next use
      repoName = 'poko-capsule-website';
      selectedOrg = '';
      defaultBranchOnly = false;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      forkResult = `<p class="error">Error: ${errorMsg}</p>`;
    } finally {
      // Refresh the repository list to include the new fork
      await loadUserData();
      authState.isLoading = false;
    }
  };
  
  // Initialize on component mount
  $effect(() => {
    initAuth();
  });
</script>

<div class="github-integration">
  {#if !authState.isAuthenticated}
    <div class="login-section">
      <p>Sign in with GitHub to manage your repositories</p>
      <button class="primary-button" onclick={login}>Login with GitHub</button>
    </div>
  {:else}
    <div class="authenticated-section">
      <div class="user-info">
        <span>Logged in as: <strong>{authState.user.login || 'Unknown'}</strong></span>
        <button class="secondary-button" onclick={logout}>Logout</button>
      </div>
      
      <section>
        <h2>Your Repositories</h2>
        
        {#if authState.isLoading}
          <div class="loading">Loading repositories...</div>
        {/if}
        
        {#if authState.errorMessage}
          <div class="error">{authState.errorMessage}</div>
        {/if}
        
        <ul class="repo-list">
          {#if authState.repositories.length === 0 && !authState.isLoading}
            <li>No repositories found</li>
          {:else}
            {#each authState.repositories as repo}
              <li>
                <a href={repo.html_url} target="_blank" rel="noopener">
                  {repo.full_name}
                </a>
                <span>{repo.private ? '🔒 Private' : '🌐 Public'}</span>
                {#if repo.fork}
                  <span>🍴 Fork</span>
                {/if}
              </li>
            {/each}
          {/if}
        </ul>
      </section>
      
      <section>
        <h2>Fork m4rrc0/poko-capsule-website</h2>
        <form onsubmit={handleForkSubmit}>
          <div>
            <label for="repo-name">New Repository Name:</label>
            <input 
              type="text" 
              id="repo-name" 
              bind:value={repoName} 
              required 
              placeholder="poko-capsule-website"
            />
          </div>
          <div>
            <label for="org-select">Target Organization:</label>
            <select id="org-select" bind:value={selectedOrg}>
              <option value="">Personal Account</option>
              {#if authState.organizations && authState.organizations.length > 0}
                {#each authState.organizations as org}
                  <option value={org.login}>{org.login}</option>
                {/each}
              {/if}
            </select>
          </div>
          
          <div>
            <label>
              <input type="checkbox" bind:checked={defaultBranchOnly} />
              Default branch only (faster fork)
            </label>
          </div>
          
          <button type="submit">Fork Repository</button>
        </form>
        
        {#if forkResult}
          <div class="fork-result">{@html forkResult}</div>
        {/if}
      </section>
    </div>
  {/if}
</div>

<style>
  .github-integration {
    max-width: 800px;
    margin: 0 auto;
  }
  
  section {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  
  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.5rem 0;
  }
  
  .repo-list {
    list-style-type: none;
    padding: 0;
  }
  
  .repo-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  form div {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.25rem;
  }
  
  input, select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    cursor: pointer;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #eee;
  }
  
  .primary-button {
    background-color: #0366d6;
    color: white;
  }
  
  .secondary-button {
    background-color: #eee;
    color: #333;
    border: 1px solid #ccc;
  }
  
  .error {
    color: red;
    margin: 0.5rem 0;
  }
  
  .loading {
    margin: 1rem 0;
  }
  
  .fork-result {
    margin-top: 1rem;
    padding: 0.5rem;
  }
  
  /* Checkbox styling */
  input[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
    cursor: pointer;
  }
</style>
