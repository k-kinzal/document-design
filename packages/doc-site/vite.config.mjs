import { defineConfig } from 'vite-plus';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate, generatedRoot } from './src/generate.mjs';

const root = dirname(fileURLToPath(import.meta.url));
export default defineConfig(({ command, isPreview }) => {
  const development = command === 'serve' && !isPreview;
  const sourceRoot = development ? resolve(root, '.generated-dev') : generatedRoot;
  const pages = isPreview ? [] : generate({ development, outDir: sourceRoot });
  return {
    root: sourceRoot,
    base: './',
    appType: 'mpa',
    publicDir: resolve(sourceRoot, 'public'),
    server: { host: '127.0.0.1', port: 5173, strictPort: true, open: process.env.DOC_SITE_NO_OPEN ? false : '/' },
    preview: { host: '127.0.0.1', port: 4173, strictPort: true },
    build: {
      outDir: resolve(root, 'dist'),
      emptyOutDir: true,
      rolldownOptions: { input: [...pages.map(p => resolve(sourceRoot, p.path, 'index.html')), resolve(sourceRoot, '404.html')] },
    },
  };
});
