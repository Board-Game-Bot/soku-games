import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve';

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      { file: './dist/index.cjs', format: 'cjs' },
      { file: './dist/index.mjs', format: 'esm' },
    ],
    plugins: [ts(), nodeResolve()],
  },
  {
    input: './src/index.ts',
    output: [{ file: './dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]);
