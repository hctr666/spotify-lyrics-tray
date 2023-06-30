import { defineConfig } from 'vite'
import path from 'path'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import react from '@vitejs/plugin-react'

const appRoot = path.resolve(process.cwd(), 'src/renderer/app/')

// https://vitejs.dev/config/
export default defineConfig({
  root: appRoot,
  server: {
    port: 4014,
    open: false,
  },
  build: {
    outDir: path.resolve(appRoot, 'build'),
  },
  resolve: {
    alias: {
      '~': path.resolve(appRoot, 'src'),
    },
  },
  plugins: [
    react(),
    electron([
      {
        entry: 'src/main/bootstrap.js',
      },
      {
        entry: 'src/preload/app.js',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
})
