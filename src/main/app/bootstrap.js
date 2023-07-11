import { app, safeStorage } from 'electron'

import { initializeIpcMainEvents } from './ipc-events'
import { Application } from './application'
import { isDevelopment } from '../helpers/environment'

const main = new Application()

app.whenReady().then(async () => {
  main.handleFileProtocol()

  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption is not available')
  }

  await main.spotifyWebWindow.create()

  if (isDevelopment()) {
    main.handleSpotifyWebWindowReload()
  }

  main.appWindow.create()
  main.handleAuthServiceEvents()
  main.handleAuthRedirectUriRequest()
  main.handleSpotifyServiceEvents()
  main.initializeTrayApp()
})

app.on('activate', () => {
  const appWindow = main.appWindow.getWindow()
  appWindow?.show()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  global.isAppQuitting = true
})

initializeIpcMainEvents()
