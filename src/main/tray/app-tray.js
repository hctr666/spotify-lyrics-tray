import path from 'path'
import { Tray, app } from 'electron'

const ICON_PATH = path.resolve(__dirname, 'images/trayIconTemplate.png')

export class AppTray {
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
