const { BrowserWindow } = require('electron')

const BaseWindow = require('./base-window')

class AuthWindow extends BaseWindow {
  create() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        devTools: true,
      },
    })

    const url = global.authService.getAuthUrl()

    // This url is not expected to finish load...
    // so there's no need to wait for its resolution
    this.window.loadURL(url)
  }
}

module.exports = AuthWindow
