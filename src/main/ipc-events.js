const { ipcMain } = require('electron')
const {
  SLA_LYRICS_CONNECT,
  SLA_AUTH_SIGN_OUT,
  SLA_AUTH_SIGN_IN,
  SLA_LYRICS_SERVICE_STATE_REPLY,
  SLA_LYRICS_CONNECT_REQUEST,
  SLA_LYRICS_SERVICE_STATE_REQUEST,
  SLA_TRACK_LYRICS_REQUEST,
  SLA_TRACK_LYRICS_REPLY,
  SLA_GET_PLAYBACK_STATE,
  SLA_START_OR_RESUME_PLAYBACK,
  SLA_PAUSE_PLAYBACK,
  SLA_SKIP_TO_NEXT_TRACK,
  SLA_SKIP_TO_PREVIOUS_TRACK,
  SLA_GET_TRACK,
} = require('./constants/ipc-channels')
const { SpotifyClient } = require('./libs/spotify-client')

const sendToSpotifyWebWindow = (channel, ...args) => {
  /** @type {Electron.BrowserWindow | null} */
  const spotifyWebWindow = global.spotifyWebWindow.getWindow()

  if (spotifyWebWindow) {
    spotifyWebWindow.webContents.send(channel, ...args)
  }
}

const sendToAppWindow = (channel, value) => {
  /** @type {Electron.BrowserWindow | null} */
  const appWindow = global.appWindow.getWindow()

  if (appWindow) {
    appWindow.webContents.send(channel, value)
  }
}

const initializeIpcEvents = () => {
  ipcMain.on(SLA_LYRICS_CONNECT, () => {
    sendToSpotifyWebWindow(SLA_LYRICS_CONNECT_REQUEST)
  })

  ipcMain.on(SLA_AUTH_SIGN_OUT, () => {
    global.authService.logout()
  })

  ipcMain.on(SLA_AUTH_SIGN_IN, () => {
    global.authWindow.create()
  })

  ipcMain.on(SLA_LYRICS_SERVICE_STATE_REQUEST, () => {
    sendToSpotifyWebWindow(SLA_LYRICS_SERVICE_STATE_REQUEST)
  })

  ipcMain.on(SLA_LYRICS_SERVICE_STATE_REPLY, (_event, status) => {
    sendToAppWindow(SLA_LYRICS_SERVICE_STATE_REPLY, status)
  })

  ipcMain.handle(SLA_TRACK_LYRICS_REQUEST, (_event, trackId, imageUrl) => {
    sendToSpotifyWebWindow(SLA_TRACK_LYRICS_REQUEST, trackId, imageUrl)
  })

  ipcMain.on(SLA_TRACK_LYRICS_REPLY, (_event, lyrics, error) => {
    sendToAppWindow(SLA_TRACK_LYRICS_REPLY, lyrics, error)
  })

  ipcMain.handle(SLA_GET_PLAYBACK_STATE, async () => {
    const playbackState = await global.spotifyPlaybackPollingService.getState()
    return playbackState
  })

  ipcMain.handle(
    SLA_START_OR_RESUME_PLAYBACK,
    async (_event, deviceId, positionMS) => {
      await SpotifyClient.startOrResumePlayback(deviceId, positionMS)
    }
  )

  ipcMain.handle(SLA_PAUSE_PLAYBACK, async (_event, deviceId) => {
    await SpotifyClient.pausePlayback(deviceId)
  })

  ipcMain.handle(SLA_SKIP_TO_NEXT_TRACK, async (_event, deviceId) => {
    await SpotifyClient.skipToNextTrack(deviceId)
  })

  ipcMain.handle(SLA_SKIP_TO_PREVIOUS_TRACK, async (_event, deviceId) => {
    await SpotifyClient.skipToPreviousTrack(deviceId)
  })

  ipcMain.handle(SLA_GET_TRACK, async (_event, trackId) => {
    const track = await SpotifyClient.getTrack(trackId)
    return track
  })
}

module.exports = { initializeIpcEvents }
