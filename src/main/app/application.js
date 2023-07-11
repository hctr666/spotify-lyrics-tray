import { session, protocol, globalShortcut } from 'electron'
import path from 'path'

import SpotifyConstants from '../constants/spotify'
import { AuthService } from '../services/auth'
import { SpotifyPlaybackPollingService } from '../services/spotify/playback-polling-service'
import { AppWindow } from '../windows/app-window'
import { AuthWindow } from '../windows/auth-window'
import { SpotifyWebWindow } from '../windows/spotify-web-window'
import { AppTray } from '../tray/app-tray'
import { TrayManager } from '../tray/tray-manager'
import IpcChannels from '../constants/ipc-channels'

const { REDIRECT_URI } = SpotifyConstants
const { SLA_AUTH_STATE, SLA_ON_PLAYBACK_STATE } = IpcChannels

export class Application {
  constructor() {
    this.authService = new AuthService()
    this.spotifyPlaybackPollingService = new SpotifyPlaybackPollingService()
    this.appWindow = new AppWindow()
    this.authWindow = new AuthWindow()
    this.spotifyWebWindow = new SpotifyWebWindow()
    this.appTray = new AppTray()

    global.authService = this.authService
    global.spotifyPlaybackPollingService = this.spotifyPlaybackPollingService
    global.authWindow = this.authWindow
    global.appWindow = this.appWindow
    global.spotifyWebWindow = this.spotifyWebWindow
    global.appTray = this.appTray
    global.isAppQuitting = false
  }

  handleProtocolIntercept = () => {
    // TODO: use protocol.handle method
    protocol.interceptFileProtocol('file', (request, callback) => {
      if (request.url.startsWith('file:///static')) {
        return callback(
          path.resolve(
            __dirname,
            '..',
            'renderer/app/build',
            request.url.substring(8)
          )
        )
      }

      // Making sure to strip react routes out from the index url to prevent reload issues
      if (request.url.match(/\/build\/index.html#\/?((\w+-?\/?)+)?/g)) {
        return callback(
          path.resolve(__dirname, '..', 'renderer/app/build', 'index.html')
        )
      }

      return callback(request.url.substring(8))
    })
  }

  handleSpotifyServiceEvents = () => {
    this.spotifyPlaybackPollingService.on('state-changed', state => {
      const appWindow = this.appWindow.getWindow()
      appWindow?.webContents.send(SLA_ON_PLAYBACK_STATE, state)
    })
  }

  handleAuthServiceEvents = () => {
    this.authService.on('logout', () => {
      const appWindow = this.appWindow.getWindow()

      appWindow?.webContents.send(SLA_AUTH_STATE, {
        isAuthenticated: false,
      })

      this.spotifyPlaybackPollingService.abortStateCheck()
    })
  }

  handleAuthRedirectUriRequest = () => {
    const filter = {
      urls: [`${REDIRECT_URI}*`],
    }

    session.defaultSession.webRequest.onBeforeRequest(filter, async details => {
      await this.authService.requestAccessToken(details.url)

      const appWindow = this.appWindow.getWindow()

      if (appWindow) {
        appWindow.webContents.send(SLA_AUTH_STATE, {
          isAuthenticated: true,
        })
        appWindow.show()
      }

      return this.authWindow.destroy()
    })
  }

  handleGlobalShortcuts = () => {
    globalShortcut.register('CommandOrControl+Alt+L', () => {
      this.trayManager.showWindow()
    })

    // TODO: handle Escape shortcut in renderer to avoid collision with other apps
    // globalShortcut.register('Escape', () => {
    //   this.trayManager.hideWindow()
    // })
  }

  initializeTrayApp = () => {
    this.appTray.create()

    const tray = this.appTray.getTray()
    const window = this.appWindow.getWindow()
    this.trayManager = new TrayManager(tray, window)

    window.on('ready-to-show', () => {
      this.trayManager.showWindow()
      this.handleGlobalShortcuts()
    })

    global.trayManager = this.trayManager
  }

  handleSpotifyWebWindowReload = () => {
    const spotifyWebWindow = this.spotifyWebWindow.getWindow()

    global.ws.onMessage('electron:window-reload', payload => {
      if (payload.window === 'spotify-web') {
        spotifyWebWindow.webContents.reload()
      }
    })
  }
}
