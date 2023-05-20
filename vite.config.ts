import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [solidPlugin()],
      server: {
        port: 3000,
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
    };
  } else {
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
      build: {
        rollupOptions: {
          output: {
            dir: 'dist',
          },
        },
        lib: {
          entry: './src/game-redesign/index.ts',
          name: 'soku-game',
          fileName: 'index',
          formats: ['es', 'cjs', 'umd'],
        },
      },
      plugins: [dts()],
    };
  }
});
