const { session, protocol } = require('electron')
const path = require('path')

const { REDIRECT_URI } = require('./constants/spotify')
const { AuthService } = require('./services/auth')
const {
  SpotifyPlaybackPollingService,
} = require('./services/spotify/playback-polling-service')
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
    // TODO: handle deprecated interceptFileProtocol
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

  initializeTrayApp = () => {
    this.appTray.create()

    const tray = this.appTray.getTray()
    const window = this.appWindow.getWindow()
    const trayManager = new TrayManager(tray, window)

    window.on('ready-to-show', () => {
      trayManager.showWindow()
    })

    global.trayManager = trayManager
  }
}

module.exports = Application
