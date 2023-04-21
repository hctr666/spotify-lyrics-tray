// eslint-disable-next-line no-unused-vars
const { BrowserWindow } = require('electron')

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

  getInstance() {
    return this.window && !this.window.isDestroyed() ? this.window : null
  }
}

module.exports = BaseWindow
