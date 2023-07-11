/* eslint-disable no-console */
import { isDevelopment } from '../helpers/environment'
import EventEmitter from 'events'

const initWebSocketDevClient = () => {
  if (!isDevelopment()) return

  const WebSocket = require('ws')

  try {
    const eventEmmitter = new EventEmitter()
    const ws = new WebSocket(`ws://localhost:${process.env.WSS_PORT}`)

    ws.on('error', console.error)
    ws.on('message', payload => {
      try {
        const data = JSON.parse(payload.toString())
        eventEmmitter.emit(data.event, data)
      } catch (error) {
        console.error(error)
      }
    })

    ws.onMessage = (event, fn) => eventEmmitter.on(event, fn)

    global.ws = ws
  } catch (error) {
    throw new Error(error)
  }
}

initWebSocketDevClient()
