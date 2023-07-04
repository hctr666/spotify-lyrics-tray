import { defineConfig } from 'vite'

import { appBuild } from '../paths'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        dir: `${appBuild}/preload`,
      },
    },
  },
})
