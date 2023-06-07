// TODO: create spotify-web renderer ts app
const DATA_LAYER_EVENT = 'webplayer_datalayer_init'
const ELEMENT_WAIT_TIMEOUT = 4500
const GEARS_BUTTON_SELECTOR = '[data-testid="gears-button"]'
const IMMEDIATELLY_SEND_SERVICE_STATE = 'immediatelly-send-service-state'
const LOGIN_BUTTON_SELECTOR = '[data-testid="preview-menu-login"]'
const LOGOUT_BUTTON_SELECTOR = '[data-testid="settings-menu-logout"]'
const MENU_BUTTON_SELECTOR = '[data-testid="preview-menu-button"]'
const NOT_FOUND_STATUS = 404
const ROOT_SELECTOR = '#main'
const SESSION_DATA_SCRIPT_SELECTOR =
  'script[id="session"][type="application/json"]'

const UNAUTHORIZED_STATUS = 401

const errors = {
  INVALID_TOKEN: 'Invalid token',
  LYRICS_FETCH_FAILED:
    'An error occurred when getting the lyrics, please try again later',
  NO_WEBPLAYER_DATA: 'Unable to get WebPlayer data',
  NO_ACCESS_TOKEN: 'Unable to extract access token',
  ELEMENT_NOT_FOUND: 'Element was not found',
  SERVICE_LOAD_ERROR: 'Fatal error on lyrics service, please restart the app',
  SERVICE_CONNECT_FAILED:
    'Connection to service failed, tray again later or restart the app',
}

const waitForElement = selector => {
  return new Promise((resolve, reject) => {
    let element = document.querySelector(selector)

    // immediatelly resolves element when it's found early
    if (element) {
      return resolve(element)
    }

    let interval, timeout, observer

    const flush = () => {
      clearTimeout(timeout)
      clearInterval(interval)
      observer.disconnect()
      timeout = null
      interval = null
    }

    observer = new MutationObserver(() => {
      element = document.querySelector(selector)

      if (element) {
        flush()
        resolve(element)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    interval = setInterval(() => {
      if (element) {
        flush()
        resolve(element)
      }
    }, 500)

    // Rejects when not found after timeout
    timeout = setTimeout(() => {
      if (!element) {
        flush()

        const error = `${errors.ELEMENT_NOT_FOUND}: ${selector}`

        reject({ message: error })
      }
    }, ELEMENT_WAIT_TIMEOUT)
  })
}

const getAppData = () => {
  if (!('dataLayer' in window)) {
    throw new Error(errors.NO_WEBPLAYER_DATA)
  }

  return window?.dataLayer
    .filter(({ event }) => event === DATA_LAYER_EVENT)
    .map(data => ({
      isLoggedIn: data.loggedIn,
      isPremium: data.isPremium,
    }))?.[0]
}

const getLyricsApiUrl = trackId => {
  return `
    https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}/image/https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b273fb1cb900d28642e668d77b12
    ?format=json&vocalRemoval=false&market=from_token`
}

const getAccessToken = () => {
  const sessionData = document.querySelector(SESSION_DATA_SCRIPT_SELECTOR)

  if (sessionData) {
    try {
      const jsonData = JSON.parse(sessionData.innerHTML)
      return jsonData.accessToken
    } catch (_) {
      throw new Error(errors.NO_ACCESS_TOKEN)
    }
  }

  return null
}

const getTrackLyrics = async trackId => {
  // TODO: create a mocked lyrics api
  if (window.Core.isDev()) {
    const mockedApi = window.SpotifyWeb.fetchLyricsMockAPI()
    const [lyrics] = mockedApi.filter(r => r.trackId === trackId)

    await new Promise(res => setTimeout(res, 1500))

    return lyrics
  }

  try {
    const url = getLyricsApiUrl(trackId)
    const accessToken = getAccessToken()

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'app-platform': 'WebPlayer',
      },
    })

    if (response.status === NOT_FOUND_STATUS) {
      return null
    }

    if (response.status === UNAUTHORIZED_STATUS) {
      throw new Error(errors.INVALID_TOKEN)
    }

    const data = await response.json()

    return data
  } catch (error) {
    throw new Error(error)
  }
}

const logout = async () => {
  try {
    const gearButton = await waitForElement(GEARS_BUTTON_SELECTOR)
    gearButton.click()

    const logoutButton = await waitForElement(LOGOUT_BUTTON_SELECTOR)

    localStorage.setItem(IMMEDIATELLY_SEND_SERVICE_STATE, '1')
    logoutButton.click()

    window.SpotifyWeb.logInfo('logging out...')
  } catch (error) {
    throw new Error(error.message)
  }
}

const login = async () => {
  try {
    const menuButton = await waitForElement(MENU_BUTTON_SELECTOR)
    menuButton.click()

    const loginButton = await waitForElement(LOGIN_BUTTON_SELECTOR)

    localStorage.setItem(IMMEDIATELLY_SEND_SERVICE_STATE, '1')
    loginButton.click()

    window.SpotifyWeb.logInfo('Redirecting to login page...')
  } catch (error) {
    throw new Error(error.message)
  }
}

const initMain = async () => {
  /**
   * @type {{
   *   status: 'loading' | 'connected' | 'disconnected' | 'error',
   *   error: null | string
   * }}
   */
  const state = {
    status: 'loading',
    error: null,
  }

  window.SpotifyWeb.subscribeOnStateRequest(() => {
    window.SpotifyWeb.sendServiceState(state)
  })

  try {
    await waitForElement(ROOT_SELECTOR)

    const { isLoggedIn } = getAppData()
    state.status = isLoggedIn ? 'connected' : 'disconnected'

    const shouldSendServiceState = localStorage.getItem(
      IMMEDIATELLY_SEND_SERVICE_STATE
    )

    window.SpotifyWeb.logInfo(
      JSON.stringify({
        state: JSON.stringify(state),
        shouldSendServiceState,
      })
    )

    if (shouldSendServiceState) {
      if (state.status === 'connected') {
        window.SpotifyWeb.sendServiceState(state)
      } else {
        window.SpotifyWeb.sendServiceState({
          ...state,
          error: errors.SERVICE_CONNECT_FAILED,
        })
      }
      localStorage.removeItem(IMMEDIATELLY_SEND_SERVICE_STATE)
    }

    window.SpotifyWeb.subscribeOnConnect(() => {
      login().catch(error => {
        window.SpotifyWeb.logError(error.message)
        window.SpotifyWeb.sendServiceState({
          status: 'error',
          error: errors.SERVICE_CONNECT_FAILED,
        })
      })
    })

    window.SpotifyWeb.subscribeOnTrackLyrics((_event, trackId) => {
      getTrackLyrics(trackId)
        .then(data => {
          const lyrics = data
            ? {
                lines: data?.lyrics.lines,
                // TODO: send sync type value instead of boolean
                isLineSynced: data?.lyrics.syncType === 'LINE_SYNCED',
              }
            : null

          window.SpotifyWeb.sendTrackLyrics(lyrics)
        })
        .catch(error => {
          window.SpotifyWeb.logError(error.message)
          window.SpotifyWeb.sendTrackLyrics(null, errors.LYRICS_FETCH_FAILED)

          // Logout when token sent is invalid
          if (error.message === errors.INVALID_TOKEN) {
            logout().catch(error => {
              window.SpotifyWeb.logError(error.message)
            })
          }
        })
    })
  } catch (error) {
    state.error = errors.SERVICE_LOAD_ERROR
    state.status = 'error'

    window.SpotifyWeb.logError(error.message)
  }
}

;(async function () {
  await initMain()
})()
