import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pow.rs/',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  build: {
    inlineStylesheets: 'never'
  }
});
