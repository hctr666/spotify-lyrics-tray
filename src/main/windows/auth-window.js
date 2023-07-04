import { BrowserWindow } from 'electron'

import { BaseWindow } from './base-window'

export class AuthWindow extends BaseWindow {
  create() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        devTools: true,
        sandbox: false,
      },
    })

    const url = global.authService.getAuthUrl()

    // This url is not expected to finish load...
    // so there's no need to wait for its resolution
    this.window.loadURL(url)
  }
}
