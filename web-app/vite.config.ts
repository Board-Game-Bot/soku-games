import { defineConfig } from 'vite';
import uno from 'unocss/vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid(), uno()],
});
