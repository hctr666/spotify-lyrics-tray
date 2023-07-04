import { defineConfig } from 'vite'

import { appBuild, spotifyInject } from '../paths'

export default defineConfig({
  build: {
    rollupOptions: {
      input: [spotifyInject],
      output: {
        dir: appBuild,
        entryFileNames: 'spotify-inject.js',
      },
    },
  },
})
