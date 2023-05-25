const { app, session, safeStorage } = require('electron')

const { initIPCEvents } = require('./ipc-events')
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
  SLA_AUTH_STATUS,
  SLA_PLAYBACK_STATE_CHANGE,
} = require('./constants/ipc-main-channels')

global.isAppQuitting = false

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
  }

  initializeAppEvents = () => {
    app
      .whenReady()
      .then(() => {
        if (!safeStorage.isEncryptionAvailable()) {
          throw new Error('Encryption is not available')
        }

        const appWindow = this.appWindow.create()

        appWindow.webContents.once('did-finish-load', async () => {
          try {
            await this.authService.requestRefreshToken()
          } catch (error) {
            console.error(error)
          }

          appWindow.webContents.send(SLA_AUTH_STATUS, {
            isAuthenticated: this.authService.isAuthenticated(),
          })

          const spotifyWebWindow = await this.spotifyWebWindow.create()

          this.spotifyPlaybackService.on('state-changed', state => {
            spotifyWebWindow?.webContents.send(SLA_PLAYBACK_STATE_CHANGE, state)
          })

          appWindow
            .on('blur', () => {
              this.spotifyPlaybackService.stopStateCheck()
            })
            .on('focus', () => {
              if (this.authService.isAuthenticated()) {
                this.spotifyPlaybackService.initStateCheck()
              }
            })
        })

        app.on('activate', () => {
          appWindow.show()
        })

        appWindow.on('close', e => {
          if (global.isAppQuitting) {
            return appWindow.close()
          } else {
            e.preventDefault()
          }

          appWindow.hide()
        })

        this.authService.on('logout', () => {
          appWindow.webContents.send(SLA_AUTH_STATUS, {
            isAuthenticated: false,
          })

          this.spotifyPlaybackService.abortStateCheck()
        })

        this.initializeTray()
      })
      .then(() => {
        const filter = {
          urls: [`${REDIRECT_URI}*`],
        }

        session.defaultSession.webRequest.onBeforeRequest(
          filter,
          async details => {
            await this.authService.requestAccessToken(details.url)

            const appWindow = this.appWindow.getInstance()

            if (appWindow) {
              appWindow.webContents.send(SLA_AUTH_STATUS, {
                isAuthenticated: true,
              })
              appWindow.show()
            }

            return this.authWindow.destroy()
          }
        )

        session.defaultSession.webRequest.onBeforeSendHeaders(
          (details, callback) => {
            // Including a custom User-Agent value to bypass browser detection
            details.requestHeaders['User-Agent'] =
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'

            callback({ requestHeaders: details.requestHeaders })
          }
        )
      })

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit()
    })

    app.on('before-quit', () => {
      global.isAppQuitting = true
    })
  }

  initializeTray = () => {
    this.appTray.create()

    const tray = this.appTray.getInstance()
    const window = this.appWindow.getInstance()

    const trayManager = new TrayManager(tray, window)

    global.trayManager = trayManager
  }
}

const application = new Application()

application.initializeAppEvents()

initIPCEvents()
