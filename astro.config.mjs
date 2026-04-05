// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://astrollm.org',
  output: 'static',
  build: {
    assets: '_assets',
  },
});
