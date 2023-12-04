import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';

export default defineConfig([
  {
    input: './src/core.ts',
    output: [
      {
        file: './dist/index.js',
        format: 'es',
      },
    ],
    plugins: [
      ts(),
      copy({
        targets: [{ src: 'template', dest: 'dist' }],
      }),
    ],
  },
]);
