const { contextBridge, ipcRenderer } = require('electron')

const {
  SLA_LYRICS_CONNECT,
  SLA_AUTH_SIGN_OUT,
  SLA_AUTH_SIGN_IN,
  SLA_AUTH_STATE,
  SLA_LYRICS_SERVICE_STATE_REQUEST,
  SLA_LYRICS_SERVICE_STATE_REPLY,
  SLA_TRACK_LYRICS_REQUEST,
  SLA_TRACK_LYRICS_REPLY,
  SLA_GET_PLAYBACK_STATE: SLA_REQUEST_PLAYBACK_STATE,
  SLA_ON_PLAYBACK_STATE,
  SLA_START_OR_RESUME_PLAYBACK,
  SLA_PAUSE_PLAYBACK,
  SLA_SKIP_TO_NEXT_TRACK,
  SLA_SKIP_TO_PREVIOUS_TRACK,
  SLA_GET_TRACK,
} = require('../main/constants/ipc-channels')

require('./core')

contextBridge.exposeInMainWorld('LyricsService', {
  connect: () => ipcRenderer.send(SLA_LYRICS_CONNECT),
  requestServiceState: () => ipcRenderer.send(SLA_LYRICS_SERVICE_STATE_REQUEST),
  subscribeOnServiceState: listener => {
    ipcRenderer.addListener(SLA_LYRICS_SERVICE_STATE_REPLY, listener)

    return () =>
      ipcRenderer.removeListener(SLA_LYRICS_SERVICE_STATE_REPLY, listener)
  },
})

contextBridge.exposeInMainWorld('Track', {
  getTrack: trackId => ipcRenderer.invoke(SLA_GET_TRACK, trackId),
  requestLyrics: (trackId, imageUrl) =>
    ipcRenderer.invoke(SLA_TRACK_LYRICS_REQUEST, trackId, imageUrl),
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

// TODO: rename to Playback
contextBridge.exposeInMainWorld('PlaybackState', {
  play: (deviceId, positionMS) =>
    ipcRenderer.invoke(SLA_START_OR_RESUME_PLAYBACK, deviceId, positionMS),
  pause: deviceId => ipcRenderer.invoke(SLA_PAUSE_PLAYBACK, deviceId),
  skipToNext: deviceId => ipcRenderer.invoke(SLA_SKIP_TO_NEXT_TRACK, deviceId),
  skipToPrevious: deviceId =>
    ipcRenderer.invoke(SLA_SKIP_TO_PREVIOUS_TRACK, deviceId),
  getState: () => ipcRenderer.invoke(SLA_REQUEST_PLAYBACK_STATE),
  subscribeOnState: listener => {
    ipcRenderer.addListener(SLA_ON_PLAYBACK_STATE, listener)

    return () => ipcRenderer.removeListener(SLA_ON_PLAYBACK_STATE, listener)
  },
})
