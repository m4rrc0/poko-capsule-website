import 'dotenv/config'
import { resolve } from 'path';
import packageJson from './package.json' with { type: "json" };

const processEnv = typeof process !== 'undefined' ? process.env : {};

// Fallback repo URL from package.json
const fallbackRepoUrl = packageJson.repository?.url;
const fallbackRepoUrlParts = fallbackRepoUrl?.replace('.git', '').split(':')?.pop()?.split('/');
const fallbackRepoName = fallbackRepoUrlParts?.pop();
const fallbackRepoOwner = fallbackRepoUrlParts?.pop();
const fallbackRepo = `${fallbackRepoOwner}/${fallbackRepoName}`;

// Output directory
export const OUTPUT_DIR = processEnv.OUTPUT_DIR || 'dist';
// Cache directory
export const CACHE_DIR = processEnv.CACHE_DIR || 'node_modules/.astro';

// PUBLIC_CONTENT_PATH_PREFIX
export const PUBLIC_CONTENT_PATH_PREFIX = processEnv.PUBLIC_CONTENT_PATH_PREFIX || '';
// PUBLIC_CONTENT_DIR
export const PUBLIC_CONTENT_DIR = processEnv.PUBLIC_CONTENT_DIR || '_content';
// PUBLIC_WORKING_DIR merges relative paths from PUBLIC_CONTENT_PATH_PREFIX and PUBLIC_CONTENT_DIR
export const PUBLIC_WORKING_DIR = (processEnv.PUBLIC_WORKING_DIR ||
  (PUBLIC_CONTENT_PATH_PREFIX + '/' + PUBLIC_CONTENT_DIR))
    .replace(/\/+/g, '/') // Replace multiple slashes with single slash
    .replace(/\/$/, ''); // Remove trailing slash

// PUBLIC_WORKING_DIR_ABSOLUTE properly concatenate PUBLIC_CONTENT_PATH_PREFIX and PUBLIC_CONTENT_DIR
export const PUBLIC_WORKING_DIR_ABSOLUTE = processEnv.PUBLIC_WORKING_DIR_ABSOLUTE ||
  (PUBLIC_CONTENT_DIR && resolve(PUBLIC_CONTENT_PATH_PREFIX, PUBLIC_CONTENT_DIR));


// POKO_THEME
export const POKO_THEME = processEnv.POKO_THEME || 'default';
// PUBLIC_USER_DIR
export const PUBLIC_USER_DIR = processEnv.PUBLIC_USER_DIR || `_user-content`;


// Detect the current hosting provider used
export const NETLIFY_BUILD = Boolean(processEnv.NETLIFY || processEnv.NETLIFY_DEPLOYMENT_ID);
export const CLOUDFLARE_BUILD = Boolean(processEnv.CF_PAGES || processEnv.CLOUDFLARE_ACCOUNT_ID);
export const VERCEL_BUILD = Boolean(processEnv.VERCEL_DEPLOYMENT_ID);
export const LOCAL_BUILD = Boolean(!NETLIFY_BUILD && !CLOUDFLARE_BUILD && !VERCEL_BUILD);

// TODO: find a way to pass the detected REPO to the Keystatic config (Vite environment)

// VERCEL REPO inferrence
export const VERCEL_GIT_REPO_OWNER = processEnv.VERCEL_GIT_REPO_OWNER || processEnv.PUBLIC_VERCEL_GIT_REPO_OWNER;
export const VERCEL_GIT_REPO_SLUG = processEnv.VERCEL_GIT_REPO_SLUG || processEnv.PUBLIC_VERCEL_GIT_REPO_SLUG;

// NETLIFY REPO inferrence
export const REPOSITORY_URL = processEnv.REPOSITORY_URL;
const repoUrlParts = REPOSITORY_URL?.split(':')?.pop()?.split('/');
export const NETLIFY_REPO_NAME = repoUrlParts?.pop();
export const NETLIFY_REPO_OWNER = repoUrlParts?.pop();
export const NETLIFY_REPO = NETLIFY_REPO_OWNER && NETLIFY_REPO_NAME && `${NETLIFY_REPO_OWNER}/${NETLIFY_REPO_NAME}`;

// CLOUDFLARE REPO inferrence
// NOTE: Doesn't look like Cloudflare export these env variables...?

// REPO inferrence
export const REPO_OWNER = processEnv.REPO_OWNER || VERCEL_GIT_REPO_OWNER || NETLIFY_REPO_OWNER;
export const REPO_NAME = processEnv.REPO_NAME || VERCEL_GIT_REPO_SLUG || NETLIFY_REPO_NAME;
export const REPO = processEnv.REPO || (REPO_OWNER && REPO_NAME && `${REPO_OWNER}/${REPO_NAME}`) || fallbackRepo;

// Fallback hosting service for local dev
export const PREFERRED_HOSTING = processEnv.PREFERRED_HOSTING || 'netlify';

export default {
  NETLIFY_BUILD,
  CLOUDFLARE_BUILD,
  VERCEL_BUILD,
  LOCAL_BUILD,
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
  REPOSITORY_URL,
  NETLIFY_REPO_NAME,
  NETLIFY_REPO_OWNER,
  NETLIFY_REPO,
  REPO_OWNER,
  REPO_NAME,
  REPO,
  PREFERRED_HOSTING,
  PUBLIC_WORKING_DIR
}

