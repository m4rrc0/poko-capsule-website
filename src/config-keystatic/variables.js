// TODO: Simplify this by properly define all relevant frontend variables in astro.config.mjs

// Variables
// ---------
export const PUBLIC_CONTENT_PATH_PREFIX = import.meta.env.PUBLIC_CONTENT_PATH_PREFIX || '';
export const PUBLIC_CONTENT_DIR = import.meta.env.PUBLIC_CONTENT_DIR || '_content';
export const PUBLIC_WORKING_DIR = import.meta.env.PUBLIC_WORKING_DIR || PUBLIC_CONTENT_DIR;
export const PUBLIC_PARTIALS_DIR = import.meta.env.PUBLIC_PARTIALS_DIR || '_partials';
export const PUBLIC_LAYOUTS_DIR = import.meta.env.PUBLIC_LAYOUTS_DIR || '_layouts';
const VERCEL_GIT_REPO_OWNER = import.meta.env.PUBLIC_VERCEL_GIT_REPO_OWNER;
const VERCEL_GIT_REPO_SLUG = import.meta.env.PUBLIC_VERCEL_GIT_REPO_SLUG;
const VERCEL_REPO = VERCEL_GIT_REPO_OWNER && VERCEL_GIT_REPO_SLUG && `${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}`;
export const REPO = import.meta.env.PUBLIC_REPO || VERCEL_REPO || '';
export const PUBLIC_KEYSTATIC_STORAGE_LOCAL = (
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL === true ||
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL === 'true' ||
  (import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL !== 'false' && (import.meta.env.DEV || false))
);
export const LOCAL_BUILD = import.meta.env.LOCAL_BUILD || false;
export const FILES_OUTPUT_DIR = import.meta.env.FILES_OUTPUT_DIR || 'assets/files';
export const FILES_LIBRARY_OUTPUT_DIR = import.meta.env.FILES_LIBRARY_OUTPUT_DIR || `${FILES_OUTPUT_DIR}/library`;
export const GLOBAL_PARTIALS_PREFIX = typeof import.meta.env.GLOBAL_PARTIALS_PREFIX === 'string' ? import.meta.env.GLOBAL_PARTIALS_PREFIX : 'global';
export const globalPartials = import.meta.env.GLOBAL_PARTIALS || [];

// Retrieve User preferences
// -------------------------
// Global Settings
const globalSettingsEnv = import.meta.env.GLOBAL_SETTINGS;
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
