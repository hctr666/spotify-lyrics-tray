const { contextBridge, ipcRenderer } = require('electron')

const {
  SLA_SHOW_APP_WINDOW,
  SLA_LYRICS_CONNECTION_STATUS_REPLY,
  SLA_LYRICS_CONNECTION_STATUS_REQUEST,
  SLA_TRACK_LYRICS_REQUEST,
  SLA_TRACK_LYRICS_REPLY,
  SLA_LYRICS_CONNECT_REQUEST,
} = require('../main/constants/ipc-channels')

require('./core')

contextBridge.exposeInMainWorld('SpotifyWeb', {
  sendConnectionStatus: status =>
    ipcRenderer.send(SLA_LYRICS_CONNECTION_STATUS_REPLY, status),
  subscribeOnConnect: listener => {
    ipcRenderer.addListener(SLA_LYRICS_CONNECT_REQUEST, listener)

    return () =>
      ipcRenderer.removeListener(SLA_LYRICS_CONNECT_REQUEST, listener)
  },
  showAppWindow: () => ipcRenderer.send(SLA_SHOW_APP_WINDOW),
  fetchLyricsMockAPI: () => require('../../api-mocks/lyrics-mock.json'),
  sendTrackLyrics: lyrics => {
    return ipcRenderer.send(SLA_TRACK_LYRICS_REPLY, lyrics)
  },
  subscribeOnConnectionStatus: listener => {
    ipcRenderer.addListener(SLA_LYRICS_CONNECTION_STATUS_REQUEST, listener)

    return () =>
      ipcRenderer.removeListener(SLA_LYRICS_CONNECTION_STATUS_REQUEST, listener)
  },
  subscribeOnTrackLyrics: listener => {
    ipcRenderer.addListener(SLA_TRACK_LYRICS_REQUEST, listener)

    return () => ipcRenderer.removeListener(SLA_TRACK_LYRICS_REQUEST, listener)
  },
})
