// eslint-disable-next-line no-unused-vars
const { BrowserWindow } = require('electron')
const { isDevelopment } = require('../helpers/environment')
const { Logger } = require('../libs/logger')

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

  handleWebContentsLoadFailed() {
    this.window.webContents.on(
      'did-fail-load',
      (_event, errorCode, errorDescription) => {
        Logger.logError(
          JSON.stringify({
            errorCode,
            errorDescription,
          })
        )
      }
    )
  }
}

module.exports = BaseWindow
