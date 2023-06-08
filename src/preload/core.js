const { contextBridge, ipcRenderer } = require('electron')

const { isDevelopment } = require('../main/helpers/environment')

contextBridge.exposeInMainWorld('Core', {
  log: (payload, level) =>
    ipcRenderer.send('__ELECTRON_LOG__', {
      data: [payload],
      level,
    }),
  isDev: () => isDevelopment(),
})
