import { defineConfig, PluginOption, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [
    react(),
  ];
  function makeConfig(name: string): UserConfig {
    const suffix = (format: string) =>
      format === 'iife'
        ? 'js'
        : format === 'es'
          ? 'mjs'
          : 'cjs';
    return {
      plugins,
      build: {
        lib: {
          entry: `./src/${name}.ts`,
          name: 'index',
          fileName: (format) => `index.${suffix(format)}`,
          formats: ['iife', 'cjs', 'es'],
        },
        outDir: `./dist-${name}`,
        rollupOptions: {
          external: ['@soku-games/core'],
        },
      },
    };
  }
  return makeConfig(mode);
});
