const { contextBridge, ipcRenderer } = require('electron')

const {
  SLA_LYRICS_SERVICE_STATE_REPLY,
  SLA_LYRICS_SERVICE_STATE_REQUEST,
  SLA_TRACK_LYRICS_REQUEST,
  SLA_TRACK_LYRICS_REPLY,
  SLA_LYRICS_CONNECT_REQUEST,
  SLA_LOG,
} = require('../main/constants/ipc-channels')

require('./core')

contextBridge.exposeInMainWorld('SpotifyWeb', {
  sendServiceState: state =>
    ipcRenderer.send(SLA_LYRICS_SERVICE_STATE_REPLY, state),
  subscribeOnConnect: listener => {
    ipcRenderer.addListener(SLA_LYRICS_CONNECT_REQUEST, listener)

    return () =>
      ipcRenderer.removeListener(SLA_LYRICS_CONNECT_REQUEST, listener)
  },
  fetchLyricsMockAPI: () => require('../../api-mocks/lyrics-mock.json'),
  sendTrackLyrics: (lyrics, error) => {
    return ipcRenderer.send(SLA_TRACK_LYRICS_REPLY, lyrics, error)
  },
  subscribeOnStateRequest: listener => {
    ipcRenderer.addListener(SLA_LYRICS_SERVICE_STATE_REQUEST, listener)

    return () =>
      ipcRenderer.removeListener(SLA_LYRICS_SERVICE_STATE_REQUEST, listener)
  },
  subscribeOnTrackLyrics: listener => {
    ipcRenderer.addListener(SLA_TRACK_LYRICS_REQUEST, listener)

    return () => ipcRenderer.removeListener(SLA_TRACK_LYRICS_REQUEST, listener)
  },
  logError: message =>
    ipcRenderer.invoke(
      SLA_LOG,
      {
        source: 'renderer/spotify-web',
        message,
      },
      'error'
    ),
  logInfo: message =>
    ipcRenderer.invoke(SLA_LOG, {
      source: 'renderer/spotify-web',
      message,
    }),
})
