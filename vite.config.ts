import { resolve } from 'path'
import makeManifest from './utils/plugins/make-manifest'
import copyContentStyle from './utils/plugins/copy-content-style'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const root = resolve(__dirname, 'src')
const clj = resolve(__dirname, 'src', 'clojure', 'bundle')
const assetsDir = resolve(root, 'assets')
const outDir = resolve(__dirname, 'dist')
const publicDir = resolve(__dirname, 'public')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@src': root,
      '@clj': clj,
      '@assets': assetsDir,
    },
  },
  plugins: [svelte(), makeManifest()],
  publicDir,
  build: {
    outDir,
    rollupOptions: {
      input: {
        //devtools: resolve(pagesDir, 'devtools', 'index.html'),
        //panel: resolve(pagesDir, 'panel', 'index.html'),
        //content: resolve(pagesDir, 'content', 'index.ts'),
        background: resolve(root, 'background', 'index.ts'),
        popup: resolve(root, 'popup', 'index.html'),
        //newtab: resolve(pagesDir, 'newtab', 'index.html'),
        //options: resolve(pagesDir, 'options', 'index.html'),
      },
      output: {
        entryFileNames: (chunk) => `src/${chunk.name}/index.js`,
      },
    },
    target: "esnext",
  },
  css: {
    postcss: './postcss.config.cjs',
  },
})
