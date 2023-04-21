const { app, session, safeStorage } = require('electron')

const { initIPCEvents } = require('./ipc-events')
const { REDIRECT_URI } = require('./constants/spotify')
const { AuthService } = require('./services/auth')
const AppWindow = require('./windows/app-window')
const AuthWindow = require('./windows/auth-window')
const SpotifyWebWindow = require('./windows/spotify-web-window')

global.isAppQuitting = false

class Application {
  constructor() {
    this.authService = new AuthService()
    this.appWindow = new AppWindow()
    this.authWindow = new AuthWindow()

    this.spotifyWebWindow = new SpotifyWebWindow()

    global.authService = this.authService
    global.authWindow = this.authWindow
    global.appWindow = this.appWindow
    global.spotifyWebWindow = this.spotifyWebWindow
  }

  initAppEvents = () => {
    app
      .whenReady()
      .then(() => {
        if (!safeStorage.isEncryptionAvailable()) {
          throw new Error('Encryption is not available')
        }

        const appWindow = this.appWindow.create()

        appWindow.webContents.on('did-finish-load', async () => {
          try {
            await this.authService.requestRefreshToken()
          } catch (error) {
            console.error(error)
          }

          appWindow.webContents.send('spm-auth-change', {
            isAuthenticated: this.authService.isAuthenticated(),
          })

          await this.spotifyWebWindow.create()
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
          appWindow.webContents.send('spm-auth-change', {
            isAuthenticated: false,
          })
        })
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

            if (appWindow && appWindow.isVisible()) {
              appWindow.webContents.send('spm-auth-change', {
                isAuthenticated: true,
              })
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
}

const application = new Application()

application.initAppEvents()

initIPCEvents()
