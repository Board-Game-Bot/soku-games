import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      { file: './dist/index.cjs', format: 'cjs' },
      { file: './dist/index.mjs', format: 'esm' },
    ],
    plugins: [ts()],
  },
  {
    input: './src/index.ts',
    output: [{ file: './dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]);
