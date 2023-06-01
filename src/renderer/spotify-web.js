const ROOT_SELECTOR = 'main'
const MENU_BUTTON_SELECTOR = '[data-testid="preview-menu-button"]'
const LOGIN_BUTTON_SELECTOR = '[data-testid="preview-menu-login"]'
const DATA_LAYER_EVENT = 'webplayer_datalayer_init'
const SESSION_DATA_SCRIPT_SELECTOR =
  'script[id="session"][type="application/json"]'
const IMMEDIATELLY_SEND_CONNECTION_STATUS =
  'immediatelly-send-connection-status'

const ROOT_WAIT_TIMEOUT = 4500

const getAppData = () => {
  if (!('dataLayer' in window)) {
    throw new Error('Unable to get WebPlayer data')
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
      // eslint-disable-next-line no-console
      console.error('Unable to extract access token')
    }
  }

  return null
}

const getTrackLyrics = async trackId => {
  // TODO: create a playback api mock
  if (window.Core.isDev()) {
    const mockedApi = window.SpotifyWeb.fetchLyricsMockAPI()
    const [lyrics] = mockedApi.filter(r => r.trackId === trackId)

    await new Promise(res => setTimeout(res, 1500))

    return lyrics
  }

  window.Core.log({
    ctx: 'spotify-web:renderer',
    message: 'starting lyrics extraction...',
  })

  const url = getLyricsApiUrl(trackId)
  const accessToken = getAccessToken()

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'app-platform': 'WebPlayer',
      },
    })

    const data = await response.json()

    return data
  } catch (error) {
    // TODO: display a message about this error in the app
    window.Core.log(
      {
        ctx: 'spotify-web:renderer',
        message: 'Unable to get lyrics',
        error,
      },
      'error'
    )
  }

  return null
}

const getShowAppAfterLogin = () =>
  localStorage.getItem('showAppAfterLogin') === 'true'

const setShowAppAfterLogin = value => {
  localStorage.setItem('showAppAfterLogin', value)
}

const init = () =>
  new Promise((_resolve, reject) => {
    try {
      const { isLoggedIn } = getAppData()
      const showAppAfterLogin = getShowAppAfterLogin()

      const connectionStatus = isLoggedIn ? 'connected' : 'disconnected'
      const shouldSendConnectionStatus = localStorage.getItem(
        IMMEDIATELLY_SEND_CONNECTION_STATUS
      )

      window.Core.log({
        ctx: 'spotify-web:renderer',
        connectionStatus,
        showAppAfterLogin,
        shouldSendConnectionStatus,
      })

      const handleConnectionStatus = () => {
        window.SpotifyWeb.sendConnectionStatus(connectionStatus)

        if (showAppAfterLogin) {
          window.SpotifyWeb.showAppWindow()
          setShowAppAfterLogin(false)
        }
      }

      if (shouldSendConnectionStatus) {
        handleConnectionStatus()
        localStorage.removeItem(IMMEDIATELLY_SEND_CONNECTION_STATUS)
      }

      window.SpotifyWeb.subscribeOnConnectionStatus(handleConnectionStatus)

      window.SpotifyWeb.subscribeOnConnect(() => {
        setShowAppAfterLogin(true)

        const menuButton = document.querySelector(MENU_BUTTON_SELECTOR)

        if (!isLoggedIn && menuButton) {
          menuButton.click()

          const loginButton = document.querySelector(LOGIN_BUTTON_SELECTOR)

          if (loginButton) {
            loginButton.click()

            window.Core.log({
              ctx: 'spotify-web:renderer',
              message: 'Redirecting to login...',
            })
            localStorage.setItem(IMMEDIATELLY_SEND_CONNECTION_STATUS, '1')
          }
        }
      })

      window.SpotifyWeb.subscribeOnTrackLyrics((_event, trackId) => {
        if (isLoggedIn) {
          getTrackLyrics(trackId).then(data => {
            const lyrics = {
              lines: data?.lyrics.lines,
              isLineSynced: data?.lyrics.syncType === 'LINE_SYNCED',
            }

            window.Core.log({
              ctx: 'spotify-web:renderer',
              ...lyrics,
            })

            window.SpotifyWeb.sendTrackLyrics(lyrics)
          })
        } else {
          window.Core.log({
            ctx: 'spotify-web:renderer',
            error: 'Needs to login to get lyrics',
          })
        }
      })
    } catch (error) {
      reject(error)
    }
  })

const waitForPageReady = () =>
  new Promise((resolve, reject) => {
    let root = document.getElementById('ROOT_SELECTOR')

    try {
      const observer = new MutationObserver(() => {
        // Taking the #main element as root reference
        // it's working well at the time this implementation was added.
        // however this is subject to breaking changes coming from Spotify side
        root = document.getElementById(ROOT_SELECTOR)

        if (root) {
          return resolve()
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      let interval, timeout

      const flushTimers = () => {
        observer.disconnect()
        clearTimeout(timeout)
        clearInterval(interval)
        timeout = null
        interval = null
      }

      interval = setInterval(() => {
        if (root) flushTimers()
      }, 500)

      timeout = setTimeout(() => {
        if (!root) {
          flushTimers()

          const error = 'root element was not found'

          reject({ ctx: 'preload:spotify-web', error })

          throw new Error(error)
        }
      }, ROOT_WAIT_TIMEOUT)
    } catch (error) {
      return reject({ ctx: 'preload:spotify-web', error })
    }
  })

waitForPageReady()
  .then(init)
  .catch(payload => {
    window.Core.log(payload, 'error')
  })
