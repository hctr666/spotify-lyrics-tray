const path = require('path')
const { Tray, app } = require('electron')

const ICON_PATH = path.join(__dirname, 'icons/trayIconTemplate.png')

class AppTray {
  create() {
    const tray = new Tray(ICON_PATH)

    tray.setToolTip(app.getName())
    tray.setIgnoreDoubleClickEvents(true)

    this.tray = tray
  }

  getTray() {
    return this.tray
  }
}

module.exports = AppTray
