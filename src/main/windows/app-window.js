import path from 'path'
import { BrowserWindow, app } from 'electron'

import { BaseWindow } from './base-window'
import { isDevelopment } from '../helpers/environment'
import IpcChannels from '../constants/ipc-channels'
import Logger from '../libs/logger'

const { MSA_AUTH_STATE } = IpcChannels
const isDev = isDevelopment()

export class AppWindow extends BaseWindow {
  create() {
    this.window = new BrowserWindow({
      show: isDev,
      width: 400,
      height: 250,
      titleBarStyle: 'hidden',
      fullscreenable: false,
      resizable: false,
      frame: false,
      roundedCorners: false,
      transparent: true,
      webPreferences: {
        preload: path.resolve(__dirname, 'preload/app.js'),
        devTools: true,
        sandbox: false,
      },
    })

    if (isDev) {
      // TODO: implement secure url
      // eslint-disable-next-line no-undef
      this.window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    } else {
      this.window
        .loadFile(
          path.join(
            __dirname,
            // eslint-disable-next-line no-undef
            `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
          )
        )
        .catch(Logger.logError)
    }

    this.initializeEvents()
    this.initDevtools()

    return this.window
  }

  initializeEvents() {
    this.window.on('blur', () => {
      global.spotifyPlaybackPollingService.stopStateCheck()

      // There's a bug where clicking the tray icon doesn't show the window,
      // after it's been blurred, so we make sure to hide the window on blur event
      if (!this.window.webContents.isDevToolsOpened()) {
        this.window.hide()
      }
    })

    this.window.on('close', e => {
      if (global.isAppQuitting) {
        return app.quit()
      } else {
        e.preventDefault()
      }

      this.window.hide()
    })

    this.window.webContents.on('did-finish-load', async () => {
      await global.authService.requestRefreshToken()

      this.window.webContents.send(MSA_AUTH_STATE, {
        isAuthenticated: global.authService.isAuthenticated(),
      })

      this.window.on('focus', () => {
        if (global.authService.isAuthenticated()) {
          global.spotifyPlaybackPollingService.initStateCheck()
        }
      })
    })

    this.handleWebContentsLoadFailed()
  }
}
