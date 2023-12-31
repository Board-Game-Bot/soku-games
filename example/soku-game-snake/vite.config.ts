import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sokuGames from '@soku-games/vite-plugin';

export default defineConfig({
  plugins: [react(), sokuGames()],
});
