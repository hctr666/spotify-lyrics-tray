import { contextBridge, ipcRenderer } from 'electron'

import IpcChannels from '../main/constants/ipc-channels'
import './core'

const {
  MSA_LYRICS_SERVICE_STATE_REPLY,
  MSA_LYRICS_SERVICE_STATE_REQUEST,
  MSA_TRACK_LYRICS_REQUEST,
  MSA_TRACK_LYRICS_REPLY,
  MSA_LYRICS_SERVICE_CONNECT_REQUEST,
} = IpcChannels

contextBridge.exposeInMainWorld('SpotifyWeb', {
  sendServiceState: state =>
    ipcRenderer.send(MSA_LYRICS_SERVICE_STATE_REPLY, state),
  subscribeOnConnect: listener => {
    ipcRenderer.addListener(MSA_LYRICS_SERVICE_CONNECT_REQUEST, listener)

    return () =>
      ipcRenderer.removeListener(MSA_LYRICS_SERVICE_CONNECT_REQUEST, listener)
  },
  sendTrackLyrics: (lyrics, error) => {
    return ipcRenderer.send(MSA_TRACK_LYRICS_REPLY, lyrics, error)
  },
  subscribeOnStateRequest: listener => {
    ipcRenderer.addListener(MSA_LYRICS_SERVICE_STATE_REQUEST, listener)

    return () =>
      ipcRenderer.removeListener(MSA_LYRICS_SERVICE_STATE_REQUEST, listener)
  },
  subscribeOnTrackLyrics: listener => {
    ipcRenderer.addListener(MSA_TRACK_LYRICS_REQUEST, listener)

    return () => ipcRenderer.removeListener(MSA_TRACK_LYRICS_REQUEST, listener)
  },
})
