import { defineConfig } from 'vite'

import { mainPublic, appBuild } from '../paths'

export default defineConfig({
  publicDir: mainPublic,
  build: {
    rollupOptions: {
      output: {
        dir: appBuild,
        entryFileNames: 'main.js',
      },
      external: ['ws'],
    },
  },
  resolve: {
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
})
