import path from 'path'
import fs from 'fs/promises'
import { BrowserWindow } from 'electron'

import { getIsSpotifyOpenUrl } from '../helpers/isSpotifyOpenUrl'
import { getIsSpotifyAccountsUrl } from '../helpers/isSpotifyAccountsUrl'
import SpotifyConstants from '../constants/spotify'
import { BaseWindow } from './base-window'
import { isDevelopment } from '../helpers/environment'
import Logger from '../libs/logger'

const { SPOTIFY_WEB_URL } = SpotifyConstants
const isDev = isDevelopment()

const getSpotifyRendererScript = async () => {
  try {
    const file = await fs.readFile(path.join(__dirname, 'spotify-inject.js'))

    return file.toString()
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * This window represents the process running in the background
 * in charge of providing lyrics to the main application
 */
export class SpotifyWebWindow extends BaseWindow {
  async create() {
    this.window = new BrowserWindow({
      show: isDev,
      width: 750,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload/spotify-web.js'),
        devTools: isDev,
        sandbox: false,
      },
    })

    try {
      await this.window.loadURL(SPOTIFY_WEB_URL)
      await this.#handleWindowDidFinishLoad(SPOTIFY_WEB_URL)
    } catch (error) {
      Logger.logError(error)
    }

    this.window.webContents.on('did-finish-load', async () => {
      await this.#handleWindowDidFinishLoad(this.window.webContents.getURL())
    })

    this.handleWebContentsLoadFailed()
    this.initDevtools()

    return this.window
  }

  #handleWindowDidFinishLoad = async url => {
    const isSpotifyOpenUrl = getIsSpotifyOpenUrl(url)
    const isSpotifyAccountsUrl = getIsSpotifyAccountsUrl(url)

    // Handling when the window has loaded url under 'open' subdomain
    if (isSpotifyOpenUrl) {
      await this.#handleOpenSubdomainWasLoaded()
    }

    // Shows the window whenever it loads the signin/signup page
    if (isSpotifyAccountsUrl) {
      this.window.show()
    }
  }

  #handleOpenSubdomainWasLoaded = async () => {
    if (this.window.isVisible() && !isDev) {
      this.window.hide()
    }

    try {
      const rendererScript = await getSpotifyRendererScript()

      // Injecting renderer script this way as we're loading and external web
      // TODO: research other ways to inject the renderer into this window
      await this.window.webContents.executeJavaScript(rendererScript)
    } catch (error) {
      Logger.logError(error)
    }
  }
}

module.exports = SpotifyWebWindow
