// Variables
// ---------
export const PUBLIC_CONTENT_PATH_PREFIX = import.meta.env.PUBLIC_CONTENT_PATH_PREFIX || '';
export const PUBLIC_CONTENT_DIR = import.meta.env.PUBLIC_CONTENT_DIR || '_content';
export const PUBLIC_WORKING_DIR = import.meta.env.PUBLIC_WORKING_DIR || PUBLIC_CONTENT_DIR;
const VERCEL_GIT_REPO_OWNER = import.meta.env.PUBLIC_VERCEL_GIT_REPO_OWNER;
const VERCEL_GIT_REPO_SLUG = import.meta.env.PUBLIC_VERCEL_GIT_REPO_SLUG;
const VERCEL_REPO = VERCEL_GIT_REPO_OWNER && VERCEL_GIT_REPO_SLUG && `${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}`;
export const REPO = import.meta.env.PUBLIC_REPO || VERCEL_REPO || '';
export const PUBLIC_KEYSTATIC_STORAGE_LOCAL = (
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL === true ||
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL === 'true' ||
  (import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL !== 'false' && (import.meta.env.DEV || false))
);

// Retrieve User preferences
// -------------------------
// Global Settings
const globalSettingsEnv = import.meta.env.PUBLIC_GLOBAL_SETTINGS;
export const globalSettings = typeof globalSettingsEnv === 'string' ? JSON.parse(globalSettingsEnv) : globalSettingsEnv || {};

let userConfig = {}
try {
  userConfig = await import('#workingDir/_config/index.js')
  console.info('INFO: User config file found');
  // console.log({ 'userConfig navigation': userConfig.navigation })
} catch (error) {
  console.info('INFO: No user config file found');
}

export const { singletons: userSingletons, collections: userCollections, navigation: userNavigation } = userConfig;
