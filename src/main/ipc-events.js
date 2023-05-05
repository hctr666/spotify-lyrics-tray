const { ipcMain } = require('electron')
const {
  SLA_LYRICS_DISCONNECT,
  SLA_LYRICS_CONNECT,
  SLA_AUTH_SIGN_OUT,
  SLA_AUTH_SIGN_IN,
  SLA_LYRICS_CONNECTION_STATUS,
  SLA_LOG,
  SLA_SHOW_APP_WINDOW,
} = require('./constants/ipc-main-channels')
const {
  SLA_LYRICS_CONNECTION_CHANGED,
  SLA_LYRICS_WEB_LOGIN_INVOKED,
} = require('./constants/ipc-renderer-channels')

const initIPCEvents = () => {
  ipcMain.on(SLA_LYRICS_DISCONNECT, () => {
    const spotifyWebWindow = global.spotifyWebWindow.getInstance()

    if (spotifyWebWindow) {
      spotifyWebWindow.webContents.session.clearStorageData()
    }
  })

  ipcMain.on(SLA_LYRICS_CONNECT, async () => {
    const spotifyWebWindow = global.spotifyWebWindow.getInstance()

    if (spotifyWebWindow) {
      spotifyWebWindow.webContents.send(SLA_LYRICS_WEB_LOGIN_INVOKED)
    }
  })

  ipcMain.on(SLA_SHOW_APP_WINDOW, async () => {
    const appWindow = global.appWindow.getInstance()

    appWindow.show()
  })

  ipcMain.on(SLA_AUTH_SIGN_OUT, () => {
    console.log({ ctx: 'ipc-main', message: 'API sign out' })
    global.authService.logout()
  })

  ipcMain.on(SLA_AUTH_SIGN_IN, async () => {
    console.log({ ctx: 'ipc-main', message: 'API sign in' })
    global.authWindow.create()
  })

  ipcMain.handle(SLA_LYRICS_CONNECTION_STATUS, (_, status) => {
    console.log({ ctx: 'ipc-main', status })

    /** @type {Electron.BrowserWindow | null} */
    const appWindow = global.appWindow.getInstance()

    if (appWindow) {
      appWindow.webContents.send(SLA_LYRICS_CONNECTION_CHANGED, status)
    }
  })

  ipcMain.handle(SLA_LOG, (_event, payload, level) => {
    switch (level) {
      case 'error':
        return console.error(`[application:main]: ${JSON.stringify(payload)}`)
      default:
        return console.info(`[application:main]: ${JSON.stringify(payload)}`)
    }
  })
}

module.exports = { initIPCEvents }
