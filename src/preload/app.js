const { contextBridge, ipcRenderer } = require('electron')

const {
  SLA_LYRICS_DISCONNECT,
  SLA_LYRICS_CONNECT,
  SLA_AUTH_SIGN_OUT,
  SLA_AUTH_SIGN_IN,
  SLA_AUTH_STATE,
  SLA_LYRICS_CONNECTION_STATUS_REQUEST,
  SLA_LYRICS_CONNECTION_STATUS_REPLY,
  SLA_TRACK_LYRICS_REQUEST,
  SLA_TRACK_LYRICS_REPLY,
  SLA_GET_PLAYBACK_STATE: SLA_REQUEST_PLAYBACK_STATE,
  SLA_ON_PLAYBACK_STATE,
} = require('../main/constants/ipc-channels')

require('./core')

contextBridge.exposeInMainWorld('LyricsService', {
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
  requestLyrics: trackId =>
    ipcRenderer.invoke(SLA_TRACK_LYRICS_REQUEST, trackId),
  subscribeOnLyrics: listener => {
    ipcRenderer.addListener(SLA_TRACK_LYRICS_REPLY, listener)

    return () => ipcRenderer.removeListener(SLA_TRACK_LYRICS_REPLY, listener)
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

contextBridge.exposeInMainWorld('PlaybackState', {
  getState: () => ipcRenderer.invoke(SLA_REQUEST_PLAYBACK_STATE),
  subscribeOnState: listener => {
    ipcRenderer.addListener(SLA_ON_PLAYBACK_STATE, listener)

    return () => ipcRenderer.removeListener(SLA_ON_PLAYBACK_STATE, listener)
  },
})
