const { contextBridge, ipcRenderer } = require('electron')

const {
  SLA_LYRICS_DISCONNECT,
  SLA_LYRICS_CONNECT,
  SLA_AUTH_SIGN_OUT,
  SLA_AUTH_SIGN_IN,
  SLA_AUTH_STATE,
  SLA_LYRICS_CONNECTION_STATUS_REQUEST,
  SLA_LYRICS_CONNECTION_STATUS_REPLY,
  SLA_LYRICS_CURRENT_TRACK_REQUEST,
  SLA_LYRICS_CURRENT_TRACK_REPLY,
} = require('../main/constants/ipc-channels')

require('./core')

contextBridge.exposeInMainWorld('Lyrics', {
  connect: () => ipcRenderer.send(SLA_LYRICS_CONNECT),
  disconnect: () => ipcRenderer.send(SLA_LYRICS_DISCONNECT),
  requestConnectionStatus: () =>
    ipcRenderer.send(SLA_LYRICS_CONNECTION_STATUS_REQUEST),

  subscribeOnConnectionStatus: listener => {
    ipcRenderer.addListener(SLA_LYRICS_CONNECTION_STATUS_REPLY, listener)

    return () =>
      ipcRenderer.removeListener(SLA_LYRICS_CONNECTION_STATUS_REPLY, listener)
  },
})

contextBridge.exposeInMainWorld('Track', {
  requestCurrentTrack: () =>
    ipcRenderer.invoke(SLA_LYRICS_CURRENT_TRACK_REQUEST),
  subscribeOnCurrentTrack: listener => {
    ipcRenderer.addListener(SLA_LYRICS_CURRENT_TRACK_REPLY, listener)

    return () =>
      ipcRenderer.removeListener(SLA_LYRICS_CURRENT_TRACK_REPLY, listener)
  },
})

contextBridge.exposeInMainWorld('Auth', {
  signOut: () => ipcRenderer.send(SLA_AUTH_SIGN_OUT),
  signIn: () => ipcRenderer.send(SLA_AUTH_SIGN_IN),
  subscribe: listener => {
    ipcRenderer.addListener(SLA_AUTH_STATE, listener)

    return () => ipcRenderer.removeListener(SLA_AUTH_STATE, listener)
  },
})
