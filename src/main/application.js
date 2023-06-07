const { session } = require('electron')

const { REDIRECT_URI } = require('./constants/spotify')
const { AuthService } = require('./services/auth')
const {
  SpotifyPlaybackService,
} = require('./services/spotify/spotify-playback-service')
const AppWindow = require('./windows/app-window')
const AuthWindow = require('./windows/auth-window')
const SpotifyWebWindow = require('./windows/spotify-web-window')
const AppTray = require('./tray/app-tray')
const TrayManager = require('./tray/tray-manager')
const {
  SLA_AUTH_STATE,
  SLA_ON_PLAYBACK_STATE,
} = require('./constants/ipc-channels')

class Application {
  constructor() {
    this.authService = new AuthService()
    this.spotifyPlaybackService = new SpotifyPlaybackService()
    this.appWindow = new AppWindow()
    this.authWindow = new AuthWindow()
    this.spotifyWebWindow = new SpotifyWebWindow()
    this.appTray = new AppTray()

    global.authService = this.authService
    global.spotifyPlaybackService = this.spotifyPlaybackService
    global.authWindow = this.authWindow
    global.appWindow = this.appWindow
    global.spotifyWebWindow = this.spotifyWebWindow
    global.appTray = this.appTray
    global.isAppQuitting = false
  }

  handleSpotifyServiceEvents = () => {
    this.spotifyPlaybackService.on('state-changed', state => {
      const appWindow = this.appWindow.getInstance()
      appWindow?.webContents.send(SLA_ON_PLAYBACK_STATE, state)
    })
  }

  handleAuthServiceEvents = () => {
    this.authService.on('logout', () => {
      const appWindow = this.appWindow.getInstance()

      appWindow?.webContents.send(SLA_AUTH_STATE, {
        isAuthenticated: false,
      })

      this.spotifyPlaybackService.abortStateCheck()
    })
  }

  handleAuthRedirectUriRequest = () => {
    const filter = {
      urls: [`${REDIRECT_URI}*`],
    }

    session.defaultSession.webRequest.onBeforeRequest(filter, async details => {
      await this.authService.requestAccessToken(details.url)

      const appWindow = this.appWindow.getInstance()

      if (appWindow) {
        appWindow.webContents.send(SLA_AUTH_STATE, {
          isAuthenticated: true,
        })
        appWindow.show()
      }

      return this.authWindow.destroy()
    })
  }

  initializeTrayApp = () => {
    this.appTray.create()

    const tray = this.appTray.getInstance()
    const window = this.appWindow.getInstance()
    const trayManager = new TrayManager(tray, window)

    window.on('ready-to-show', () => {
      trayManager.showWindow()
    })

    global.trayManager = trayManager
  }
}

module.exports = Application
