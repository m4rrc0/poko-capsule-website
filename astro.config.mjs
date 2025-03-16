import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
// import cloudflare from '@astrojs/cloudflare';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  srcDir: './cms',
  integrations: [react(), markdoc(), keystatic()],
  // adapter: cloudflare(),
  adapter: netlify(),
});