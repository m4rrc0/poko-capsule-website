import { resolve, dirname } from 'path';
import yaml from 'js-yaml';
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from "@astrojs/cloudflare";
import netlify from "@astrojs/netlify";
import vercel from "@astrojs/vercel";
import node from '@astrojs/node';
import { consoleInfo, readFirstExistingFile } from './src/utils/build.js';
import { PUBLIC_CONTENT_PATH_PREFIX, PUBLIC_CONTENT_DIR, PUBLIC_WORKING_DIR, PUBLIC_WORKING_DIR_ABSOLUTE, LOCAL_BUILD, PREFERRED_HOSTING, NETLIFY_BUILD, CLOUDFLARE_BUILD, VERCEL_BUILD, INTERNAL_SYMLINK_PATH } from "./config.env.js";

const cloudflareOptions = {
  platformProxy: { enabled: true, configPath: 'wrangler.jsonc', experimentalJsonConfig: true }
}

const nodeOptions = { mode: 'standalone' }

// NOTE: Cloudflare workaround for Error:
// `Failed to publish your Function. Got error: Uncaught ReferenceError: MessageChannel is not defined`
// https://github.com/withastro/adapters/pull/436#issuecomment-2525190557
// https://github.com/withastro/astro/issues/12824#issuecomment-2563095382
const cloudflareViteConfig = {
  resolve: {
    // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
    // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
    alias: (import.meta.env.PROD || import.meta.env.NODE_ENV === 'production') && {
      "react-dom/server": "react-dom/server.edge",
    },
  },
  // ssr: { external: ['node:process'] }, // To activate node compat for specific packages
}

const adapterConfig = {
  ...((LOCAL_BUILD && PREFERRED_HOSTING === 'cloudflare' && cloudflareOptions) || {}),
  ...((LOCAL_BUILD && PREFERRED_HOSTING === 'node' && nodeOptions) || {}),
}

const adapter = LOCAL_BUILD
  ? { netlify, cloudflare, vercel, node }[PREFERRED_HOSTING](adapterConfig)
  : (NETLIFY_BUILD && netlify()) ||
  (CLOUDFLARE_BUILD && cloudflare(cloudflareOptions)) ||
  (VERCEL_BUILD && vercel());

// Retrieve User preferences
let globalSettings;
try {
  const globalSettingsYaml = await readFirstExistingFile([
    `${PUBLIC_WORKING_DIR}/_data/globalSettings.yaml`,
    `${PUBLIC_CONTENT_DIR}/_data/globalSettings.yaml`,
  ]);
  
  if (globalSettingsYaml) {
    globalSettings = yaml.load(globalSettingsYaml);
    consoleInfo(`Global settings loaded successfully for ${globalSettings?.siteName}`);
  } else {
    consoleInfo('Global settings file not found, skipping...');
  }
} catch (e) {
  consoleInfo(`Error loading global settings: ${e.message}`);
}

/** @type {import('vite').UserConfig} */
const viteConfig = {
  // TODO: need to find a way to include files that are excluded by .gitignore
  // server: {
  //   watch: {
  //     ignored: ['node_modules/**', `!./${PUBLIC_WORKING_DIR}/**`],
  //     usePolling: true,
  //     interval: 1000
  //   },
  //   fs: {
  //     strict: false,
  //     allow: [
  //       // Allow serving files from the project root
  //       '.',
  //       // Allow serving files from one level up (if needed)
  //       // '..',
  //       // Explicitly allow the content directory with absolute path
  //       new URL(`./${PUBLIC_WORKING_DIR}`, import.meta.url).pathname
  //     ]
  //   }
  // },
  // To be able to work with local libraries
  ...(LOCAL_BUILD ? {
    server: {
      fs: {
        allow: [
          ".",
          "../../libraries/",
        ],
      },
    },
  } : {}),
  define: {
    'import.meta.env.LOCAL_BUILD': JSON.stringify(LOCAL_BUILD),
    'import.meta.env.PREFERRED_HOSTING': JSON.stringify(PREFERRED_HOSTING),
    'import.meta.env.NETLIFY_BUILD': JSON.stringify(NETLIFY_BUILD),
    'import.meta.env.CLOUDFLARE_BUILD': JSON.stringify(CLOUDFLARE_BUILD),
    'import.meta.env.VERCEL_BUILD': JSON.stringify(VERCEL_BUILD),
    'import.meta.env.PUBLIC_GLOBAL_SETTINGS': JSON.stringify(globalSettings || {}),
    // Content preferences
    'import.meta.env.PUBLIC_CONTENT_PATH_PREFIX': JSON.stringify(PUBLIC_CONTENT_PATH_PREFIX),
    'import.meta.env.PUBLIC_CONTENT_DIR': JSON.stringify(PUBLIC_CONTENT_DIR),
    'import.meta.env.PUBLIC_WORKING_DIR': JSON.stringify(PUBLIC_WORKING_DIR),
    'import.meta.env.INTERNAL_SYMLINK_PATH': JSON.stringify(INTERNAL_SYMLINK_PATH),
  },
  resolve: {
    alias: {
      "#contentDir": resolve(dirname(new URL(import.meta.url).pathname), PUBLIC_CONTENT_DIR),
      "#workingDir": resolve(dirname(new URL(import.meta.url).pathname), PUBLIC_WORKING_DIR),
      "#workingDirAbsolute": resolve(dirname(new URL(import.meta.url).pathname), PUBLIC_WORKING_DIR_ABSOLUTE),
      // "#content-ext": resolve(dirname(new URL(import.meta.url).pathname), INTERNAL_SYMLINK_PATH),
    },
  },
  ...((LOCAL_BUILD && PREFERRED_HOSTING === 'cloudflare') || CLOUDFLARE_BUILD) ? cloudflareViteConfig : {}
}

// https://astro.build/config
export default defineConfig({
  srcDir: './cms',
  integrations: [
    // ...(PUBLIC_CONTENT_IS_SYMLINK ? [contentSymlinkIntegration()] : []),
    svelte(),
    react(),
    markdoc(),
    keystatic()
  ],
  adapter,
  vite: viteConfig
});
