import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import optimizer from 'vite-plugin-optimizer';
import { devPlugin, getReplacer } from './plugins/devPlugin';
import { buildPlugin } from './plugins/buildPlugin';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    optimizer(getReplacer()),
    devPlugin(),
    vue(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0'
  },
  build: {
    rollupOptions: {
      plugins: [buildPlugin()]
    }
  }
});
