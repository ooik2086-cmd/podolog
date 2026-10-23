import { defineConfig } from 'astro/config';

// Статикалық беттер. Серверде әкімші өзгерткенде сайт қайта жиналады:
// OUT_DIR — жаңа нұсқаның қалтасы, ASTRO_CACHE — уақытша файлдар (server/build.mjs береді).
export default defineConfig({
  site: 'https://podology.com.kz',
  outDir: process.env.OUT_DIR || './dist',
  cacheDir: process.env.ASTRO_CACHE || './node_modules/.astro',
  build: { assets: 'assets', format: 'file', inlineStylesheets: 'always' },
  trailingSlash: 'never',
});
