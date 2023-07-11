import { contextBridge, ipcRenderer } from 'electron'

import IpcChannels from '../main/constants/ipc-channels'
import './core'

const {
  MSA_LYRICS_SERVICE_CONNECT,
  MSA_SIGN_OUT,
  MSA_SIGN_IN,
  MSA_AUTH_STATE,
  MSA_LYRICS_SERVICE_STATE_REQUEST,
  MSA_LYRICS_SERVICE_STATE_REPLY,
  MSA_TRACK_LYRICS_REQUEST,
  MSA_TRACK_LYRICS_REPLY,
  MSA_GET_PLAYBACK_STATE,
  MSA_ON_PLAYBACK_STATE,
  MSA_START_OR_RESUME_PLAYBACK,
  MSA_PAUSE_PLAYBACK,
  MSA_SKIP_TO_NEXT_TRACK,
  MSA_SKIP_TO_PREVIOUS_TRACK,
  MSA_GET_TRACK,
} = IpcChannels

contextBridge.exposeInMainWorld('LyricsService', {
  connect: () => ipcRenderer.send(MSA_LYRICS_SERVICE_CONNECT),
  requestState: () => ipcRenderer.send(MSA_LYRICS_SERVICE_STATE_REQUEST),
  subscribeOnState: listener => {
    ipcRenderer.addListener(MSA_LYRICS_SERVICE_STATE_REPLY, listener)

    return () =>
      ipcRenderer.removeListener(MSA_LYRICS_SERVICE_STATE_REPLY, listener)
  },
})

contextBridge.exposeInMainWorld('Track', {
  getTrack: trackId => ipcRenderer.invoke(MSA_GET_TRACK, trackId),
  requestLyrics: (trackId, imageUrl) =>
    ipcRenderer.invoke(MSA_TRACK_LYRICS_REQUEST, trackId, imageUrl),
  subscribeOnLyrics: listener => {
    ipcRenderer.addListener(MSA_TRACK_LYRICS_REPLY, listener)

    return () => ipcRenderer.removeListener(MSA_TRACK_LYRICS_REPLY, listener)
  },
})

contextBridge.exposeInMainWorld('Auth', {
  signOut: () => ipcRenderer.send(MSA_SIGN_OUT),
  signIn: () => ipcRenderer.send(MSA_SIGN_IN),
  subscribe: listener => {
    ipcRenderer.addListener(MSA_AUTH_STATE, listener)

    return () => ipcRenderer.removeListener(MSA_AUTH_STATE, listener)
  },
})

contextBridge.exposeInMainWorld('Playback', {
  play: (deviceId, positionMS) =>
    ipcRenderer.invoke(MSA_START_OR_RESUME_PLAYBACK, deviceId, positionMS),
  pause: deviceId => ipcRenderer.invoke(MSA_PAUSE_PLAYBACK, deviceId),
  skipToNext: deviceId => ipcRenderer.invoke(MSA_SKIP_TO_NEXT_TRACK, deviceId),
  skipToPrevious: deviceId =>
    ipcRenderer.invoke(MSA_SKIP_TO_PREVIOUS_TRACK, deviceId),
  getState: () => ipcRenderer.invoke(MSA_GET_PLAYBACK_STATE),
  subscribeOnState: listener => {
    ipcRenderer.addListener(MSA_ON_PLAYBACK_STATE, listener)

    return () => ipcRenderer.removeListener(MSA_ON_PLAYBACK_STATE, listener)
  },
})
