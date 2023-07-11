import { defineConfig } from 'vite'
import { WebSocketServer } from 'ws'

import { appBuild, spotifyInject } from '../paths'

let wss: WebSocketServer
let ws: WebSocket

if (process.env.NODE_ENV === 'development') {
  wss = new WebSocketServer({ port: process.env.WSS_PORT })

  wss.on('connection', _ws => {
    _ws.on('error', console.error)
    console.log(`ws server running on port ${process.env.WSS_PORT}...`)
    ws = _ws
  })
}

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
  plugins: [
    {
      name: 'buildend-ws-message',
      buildEnd() {
        if (ws) {
          const message = JSON.stringify({
            event: 'electron:window-reload',
            window: 'spotify-web',
          })
          ws.send(message)
        }
      },
    },
  ],
})
