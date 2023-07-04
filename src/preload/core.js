import { contextBridge, ipcRenderer } from 'electron'

import { isDevelopment } from '../main/helpers/environment'

contextBridge.exposeInMainWorld('Core', {
  log: (payload, level) =>
    ipcRenderer.send('__ELECTRON_LOG__', {
      data: [payload],
      level,
    }),
  isDev: () => isDevelopment(),
})
