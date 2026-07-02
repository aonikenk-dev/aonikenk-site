import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://aonikenk.dev',
  output: 'static',
  adapter: vercel(),
});
