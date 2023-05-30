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

    try {
      this.window.loadURL(url)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error, url)
    }
  }
}

module.exports = AuthWindow
