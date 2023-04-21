const { contextBridge, ipcRenderer } = require('electron')

const {
  SLA_LYRICS_DISCONNECT,
  SLA_LYRICS_CONNECT,
  SLA_AUTH_SIGN_OUT,
  SLA_AUTH_SIGN_IN,
} = require('../main/constants/ipc-main-channels')

const {
  SLA_LYRICS_CONNECTION_CHANGED,
} = require('../main/constants/ipc-renderer-channels')

require('./core')

contextBridge.exposeInMainWorld('Application', {
  connectLyrics: () => ipcRenderer.send(SLA_LYRICS_CONNECT),
  disconnectLyrics: () => ipcRenderer.send(SLA_LYRICS_DISCONNECT),
  subscribeOnConnectionChange: listener => {
    ipcRenderer.addListener(SLA_LYRICS_CONNECTION_CHANGED, listener)

    return () =>
      ipcRenderer.removeListener(SLA_LYRICS_CONNECTION_CHANGED, listener)
  },
})

contextBridge.exposeInMainWorld('Auth', {
  signOut: () => ipcRenderer.send(SLA_AUTH_SIGN_OUT),
  signIn: () => ipcRenderer.send(SLA_AUTH_SIGN_IN),
  subscribeOnAuthChange: listener => {
    ipcRenderer.addListener('spm-auth-change', listener)

    return () => ipcRenderer.removeListener('spm-auth-change', listener)
  },
})
