import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-typescript2';

export default defineConfig([
  {
    input: './src/bin/index.ts',
    output: [
      {
        file: './dist/index.js',
        format: 'es',
      },
    ],
    plugins: [ts()],
  },
]);
