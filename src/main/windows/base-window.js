// eslint-disable-next-line no-unused-vars
const { BrowserWindow } = require('electron')
const { isDevelopment } = require('../helpers/environment')

class BaseWindow {
  constructor() {
    /** @type {BrowserWindow | null} */
    this.window = null
  }

  destroy() {
    if (!this.window) {
      return
    }

    this.window.close()
    this.window = null
  }

  getWindow() {
    return this.window && !this.window.isDestroyed() ? this.window : null
  }

  initDevtools() {
    if (isDevelopment()) {
      this.window.webContents.openDevTools({
        mode: 'undocked',
        activate: false,
      })
    }
  }
}

module.exports = BaseWindow
