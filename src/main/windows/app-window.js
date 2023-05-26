const path = require('path')
const { BrowserWindow, app } = require('electron')

const BaseWindow = require('./base-window')
const { isDevelopment } = require('../helpers/environment')
const { SLA_AUTH_STATE } = require('../constants/ipc-main-channels')

const isDev = isDevelopment()

class AppWindow extends BaseWindow {
  create() {
    this.window = new BrowserWindow({
      show: isDev,
      width: 400,
      height: 400,
      titleBarStyle: 'hidden',
      fullscreenable: false,
      resizable: false,
      webPreferences: {
        preload: path.join(__dirname, '..', '..', 'preload/app.js'),
        devTools: isDev,
      },
    })

    this.window.loadURL('http://localhost:4014')

    this.initializeEvents()
    this.initDevtools()

    return this.window
  }

  initializeEvents() {
    // There's a bug where clicking the tray icon doesn't show the window,
    // after it's been blurred, so we make sure to hide the window on blur event
    this.window.on('blur', () => {
      global.spotifyPlaybackService.stopStateCheck()

      if (!this.window.webContents.isDevToolsOpened()) {
        this.window.hide()
      }
    })

    this.window.on('close', e => {
      if (global.isAppQuitting) {
        return app.quit()
      } else {
        e.preventDefault()
      }

      this.window.hide()
    })

    this.window.on('focus', () => {
      if (global.authService.isAuthenticated()) {
        global.spotifyPlaybackService.initStateCheck()
      }
    })

    this.window.webContents.on('did-finish-load', async () => {
      const isAuthenticated = global.authService.isAuthenticated()

      try {
        if (!isAuthenticated) {
          await global.authService.requestRefreshToken()
        }
      } catch (error) {
        console.error(error)
      }

      this.window.webContents.send(SLA_AUTH_STATE, {
        isAuthenticated,
      })
    })
  }
}

module.exports = AppWindow
