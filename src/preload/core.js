const { contextBridge, ipcRenderer } = require('electron')
const { SLA_LOG } = require('../main/constants/ipc-main-channels')
const { isDevelopment } = require('../main/helpers/environment')

contextBridge.exposeInMainWorld('Core', {
  log: (payload, level) => ipcRenderer.invoke(SLA_LOG, payload, level),
  isDev: () => isDevelopment(),
})
