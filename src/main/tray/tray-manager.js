const getX = (trayBounds, windowWidth) => {
  const posX = Math.round(trayBounds.x + trayBounds.width / 2 - windowWidth / 2)

  return posX
}

const getY = trayBounds => Math.round(trayBounds.y + trayBounds.height)

class TrayManager {
  constructor(tray, window) {
    /** @type {Electron.Tray}  */
    this.tray = tray
    /** @type {Electron.BrowserWindow} */
    this.window = window
    this.position = {}

    this.initializeEvents()
  }

  updatePosition = () => {
    const { width } = this.window.getBounds()
    const trayBounds = this.tray.getBounds()

    const x = getX(trayBounds, width, 0)
    const y = getY(trayBounds)

    this.window.setPosition(x, y)
  }

  toggleVisibility = () => {
    if (!this.window.isVisible()) {
      this.window.show()
      this.updatePosition()
    } else {
      this.window.hide()
    }
  }

  initializeEvents = () => {
    this.tray.on('click', () => {
      this.toggleVisibility()
    })
  }
}

module.exports = TrayManager
