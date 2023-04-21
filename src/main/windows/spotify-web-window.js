const path = require('path')
const fs = require('fs').promises
const { BrowserWindow } = require('electron')

const { getIsSpotifyOpenUrl } = require('../helpers/isSpotifyOpenUrl')
const { getIsSpotifyAccountsUrl } = require('../helpers/isSpotifyAccountsUrl')
const { SPOTIFY_WEB_URL } = require('../constants/spotify')
const BaseWindow = require('./base-window')

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
  url = SPOTIFY_WEB_URL

  async create() {
    this.window = new BrowserWindow({
      show: false,
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, '..', '..', 'preload/spotify-web.js'),
        devTools: true,
      },
    })

    try {
      await this.window.loadURL(this.url)

      this.#handleWindowDidFinishLoad()
    } catch (error) {
      throw new Error(error)
    }

    this.window.webContents.on('did-finish-load', event => {
      this.url = event.sender.getURL()
      this.#handleWindowDidFinishLoad()
    })

    this.window.on('show', e => {
      const isSpotifyOpenUrl = getIsSpotifyOpenUrl(e.sender.getURL())

      if (isSpotifyOpenUrl) {
        this.window.webContents.openDevTools()
      }
    })

    return this.window
  }

  #handleWindowDidFinishLoad = async () => {
    const isSpotifyOpenUrl = getIsSpotifyOpenUrl(this.url)
    const isSpotifyAccountsUrl = getIsSpotifyAccountsUrl(this.url)

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
    if (this.window.isVisible()) {
      this.window.hide()
    }

    const rendererScript = await getSpotifyRendererScript()

    // Injecting renderer script this way as we're loading and external web
    // TODO: research other ways to inject the renderer into this window
    this.window.webContents.executeJavaScript(rendererScript)
  }
}

module.exports = SpotifyWebWindow
