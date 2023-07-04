import { defineConfig } from 'vite'

import { appRenderer } from '../paths'

export default defineConfig({
  root: appRenderer,
  server: {
    port: 4014,
    open: false,
  },
  resolve: {
    alias: {
      '~': `${appRenderer}/src`,
    },
  },
})
