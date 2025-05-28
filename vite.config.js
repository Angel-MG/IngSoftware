import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  },
  build: {
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    polyfillDynamicImport: true
  }
});