import fs from 'fs/promises';
import yaml from 'js-yaml';
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";
import cloudflare from "@astrojs/cloudflare";
import netlify from "@astrojs/netlify";
import vercel from "@astrojs/vercel";
import node from '@astrojs/node';
import { consoleInfo, readFirstExistingFile } from './src/utils/build.js';
import { PUBLIC_CONTENT_DIR, PUBLIC_WORKING_DIR, LOCAL_BUILD, PREFERRED_HOSTING, NETLIFY_BUILD, CLOUDFLARE_BUILD, VERCEL_BUILD } from "./config.env.js";

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
    alias: import.meta.env.PROD && {
      "react-dom/server": "react-dom/server.edge",
    },
  },
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
    `${PUBLIC_CONTENT_DIR}/_settings/global.yaml`,
    `${PUBLIC_WORKING_DIR}/_settings/global.yaml`,
  ]);
  
  if (globalSettingsYaml) {
    globalSettings = yaml.load(globalSettingsYaml);
    import.meta.env.PUBLIC_GLOBAL_SETTINGS = globalSettings;
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
  ...((LOCAL_BUILD && PREFERRED_HOSTING === 'cloudflare') || CLOUDFLARE_BUILD) ? cloudflareViteConfig : {}
}
  

// https://astro.build/config
export default defineConfig({
  srcDir: './cms',
  integrations: [react(), markdoc(), keystatic()],
  adapter,
  vite: viteConfig
});
