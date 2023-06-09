import { ipcMain } from 'electron'
import IpcChannels from '../constants/ipc-channels'
import { SpotifyClient } from '../libs/spotify-client'

const {
  MSA_LYRICS_SERVICE_CONNECT: SLA_LYRICS_CONNECT,
  MSA_SIGN_OUT: SLA_AUTH_SIGN_OUT,
  MSA_SIGN_IN: SLA_AUTH_SIGN_IN,
  MSA_LYRICS_SERVICE_STATE_REPLY: SLA_LYRICS_SERVICE_STATE_REPLY,
  MSA_LYRICS_SERVICE_CONNECT_REQUEST: SLA_LYRICS_CONNECT_REQUEST,
  MSA_LYRICS_SERVICE_STATE_REQUEST: SLA_LYRICS_SERVICE_STATE_REQUEST,
  MSA_TRACK_LYRICS_REQUEST: SLA_TRACK_LYRICS_REQUEST,
  MSA_TRACK_LYRICS_REPLY: SLA_TRACK_LYRICS_REPLY,
  MSA_GET_PLAYBACK_STATE: SLA_GET_PLAYBACK_STATE,
  MSA_START_OR_RESUME_PLAYBACK: SLA_START_OR_RESUME_PLAYBACK,
  MSA_PAUSE_PLAYBACK: SLA_PAUSE_PLAYBACK,
  MSA_SKIP_TO_NEXT_TRACK: SLA_SKIP_TO_NEXT_TRACK,
  MSA_SKIP_TO_PREVIOUS_TRACK: SLA_SKIP_TO_PREVIOUS_TRACK,
  MSA_GET_TRACK: SLA_GET_TRACK,
} = IpcChannels

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

export const initializeIpcMainEvents = () => {
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
