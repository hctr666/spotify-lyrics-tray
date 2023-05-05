const path = require('path')
const { BrowserWindow } = require('electron')

const BaseWindow = require('./base-window')
const { isDevelopment } = require('../helpers/environment')

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

    this.window.loadFile(
      path.join(__dirname, '..', '..', 'renderer/index.html')
    )

    this.#initializeEvents()
    this.initDevtools()

    return this.window
  }

  #initializeEvents() {
    // There's a bug where clicking the tray icon doesn't show the window,
    // after it's been blurred, so we make sure to hide the window on blur event
    this.window.on('blur', () => {
      if (!this.window.webContents.isDevToolsOpened()) {
        this.window.hide()
      }
    })
  }
}

module.exports = AppWindow
