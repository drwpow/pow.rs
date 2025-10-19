import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://pow.rs/',
  integrations: [sitemap(), mdx()],
  devToolbar: { enabled: false },
  build: {
    inlineStylesheets: 'never',
  },
});
