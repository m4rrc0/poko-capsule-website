import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import netlify from '@astrojs/netlify';

const isBuildingOnNetlify = Boolean(process.env.NETLIFY);
const isBuildingOnCloudflare = Boolean(process.env.CF_PAGES);

const adapter = isBuildingOnNetlify ? netlify() : (isBuildingOnCloudflare ? cloudflare() : undefined);

// https://astro.build/config
export default defineConfig({
  srcDir: './cms',
  integrations: [react(), markdoc(), keystatic()],
  // adapter: cloudflare(),
  adapter,
});
