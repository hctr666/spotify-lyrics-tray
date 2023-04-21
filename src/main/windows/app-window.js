const path = require('path')
const { BrowserWindow } = require('electron')

const BaseWindow = require('./base-window')

class AppWindow extends BaseWindow {
  create() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, '..', '..', 'preload/app.js'),
        devTools: true,
      },
    })

    this.window.loadFile(
      path.join(__dirname, '..', '..', 'renderer/index.html')
    )

    return this.window
  }
}

module.exports = AppWindow
