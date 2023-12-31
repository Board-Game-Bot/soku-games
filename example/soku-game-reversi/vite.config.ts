import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import sokuGames from '@soku-games/vite-plugin';

export default defineConfig({
  plugins: [
    cssInjectedByJsPlugin(),
    react(),
    sokuGames(),
  ],
});
