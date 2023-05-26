const path = require('path')
const fs = require('fs').promises
const { BrowserWindow } = require('electron')

const { getIsSpotifyOpenUrl } = require('../helpers/isSpotifyOpenUrl')
const { getIsSpotifyAccountsUrl } = require('../helpers/isSpotifyAccountsUrl')
const { SPOTIFY_WEB_URL } = require('../constants/spotify')
const BaseWindow = require('./base-window')
const { isDevelopment } = require('../helpers/environment')

const isDev = isDevelopment()

const getSpotifyRendererScript = async () => {
  try {
    const file = await fs.readFile(
      path.join(__dirname, '..', '..', 'renderer/spotify-web.js')
    )

    return file.toString()
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * This window represents the process running in the background
 * in charge of providing lyrics to the main application
 */
class SpotifyWebWindow extends BaseWindow {
  async create() {
    if (this.window) {
      return this.window
    }

    this.window = new BrowserWindow({
      show: false,
      width: 750,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, '..', '..', 'preload/spotify-web.js'),
        devTools: isDev,
      },
    })

    try {
      await this.window.loadURL(SPOTIFY_WEB_URL)
      this.#handleWindowDidFinishLoad(SPOTIFY_WEB_URL)
    } catch (error) {
      throw new Error(error)
    }

    this.window.webContents.on(
      'did-finish-load',
      async event =>
        await this.#handleWindowDidFinishLoad(event.sender.getURL())
    )

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

    const rendererScript = await getSpotifyRendererScript()

    // Injecting renderer script this way as we're loading and external web
    // TODO: research other ways to inject the renderer into this window
    await this.window.webContents.executeJavaScript(rendererScript)
  }
}

module.exports = SpotifyWebWindow
