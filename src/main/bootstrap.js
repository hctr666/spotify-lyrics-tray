const { app, safeStorage } = require('electron')

const { initializeIpcEvents } = require('./ipc-events')
const MainApplication = require('./application')

const main = new MainApplication()

app.whenReady().then(async () => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption is not available')
  }

  await main.spotifyWebWindow.create()
  main.appWindow.create()
  main.handleAuthServiceEvents()
  main.handleAuthRedirectUriRequest()
  main.handleSpotifyServiceEvents()
  main.initializeTrayApp()
})

app.on('activate', () => {
  const appWindow = main.appWindow.getInstance()
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

initializeIpcEvents()
