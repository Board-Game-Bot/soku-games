import { cpSync } from 'fs';
import { Plugin } from 'vite';

export function transformBin(): Plugin {
  return {
    name: 'transform-bin',
    buildEnd() {
      setTimeout(() => {
        cpSync('./bin', './dist/bin', { recursive: true });
      });
    },
  };
}
