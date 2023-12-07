import { defineConfig, PluginOption, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [
    react(),
  ];
  function makeConfig(name: string): UserConfig {
    return {
      plugins,
      build: {
        outDir: `./dist-${name}`,
        rollupOptions: {
          input: `./src/${name}.ts`,
          output: [{
            name: 'index',
            entryFileNames: 'index.iife.js',
            format: 'iife',
          }, {
            entryFileNames: 'index.cjs.js',
            format: 'cjs',
          }, {
            entryFileNames: 'index.esm.js',
            format: 'esm',
          }],
          external: ['@soku-games/core'],
        },
      },
    };
  }
  return makeConfig(mode);
});
