const LOGIN_BUTTON_SELECTOR = 'button[data-testid="login-button"]'
const DATA_LAYER_EVENT = 'webplayer_datalayer_init'
const SESSION_DATA_SCRIPT_SELECTOR =
  'script[id="session"][type="application/json"]'

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
      console.error('Unable to extract access token')
    }
  }

  return null
}

// eslint-disable-next-line no-unused-vars
const getTrackLyrics = async trackId => {
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

      window.Core.log({
        ctx: 'spotify-web:renderer',
        connected: isLoggedIn,
      })

      window.SpotifyWeb.sendLyricsConnectionStatus({
        connected: isLoggedIn,
      }).then(() => {
        if (showAppAfterLogin) {
          window.SpotifyWeb.showAppWindow()
          setShowAppAfterLogin(false)
        }

        window.Core.log({
          ctx: 'spotify-web:renderer',
          message: 'Status sent!',
          showAppAfterLogin,
        })
      })

      window.SpotifyWeb.subscribeOnLoginInvoked(() => {
        setShowAppAfterLogin(true)

        const loginButton = document.querySelector(LOGIN_BUTTON_SELECTOR)

        if (!isLoggedIn && loginButton) {
          window.Core.log({
            ctx: 'spotify-web:renderer',
            message: 'Redirecting to login...',
          })
          loginButton.click()
        }
      })

      window.SpotifyWeb.subscribeOnPlaybackStateChange((_event, state) => {
        const currentTrackId = localStorage.getItem('currentTrackId')

        // Make sure we only extract the lyrics when a different track is playing
        if (isLoggedIn && state.isPlaying && currentTrackId !== state.trackId) {
          getTrackLyrics(state.trackId).then(data => {
            window.Core.log({
              ctx: 'spotify-web:renderer',
              lyrics: data?.lyrics.lines,
              isLineSynced: data?.lyrics.syncType === 'LINE_SYNCED',
            })

            localStorage.setItem('currentTrackId', state.trackId)
          })
        }
      })
    } catch (error) {
      reject(error)
    }
  })

const onDOMReady = () =>
  new Promise((resolve, reject) => {
    try {
      const observer = new MutationObserver(() => {
        // Taking the #main element as reference
        // it's working well at the time this implementation was added.
        // however this is subject to breaking changes coming from Spotify side
        const main = document.getElementById('main')

        if (main) {
          return resolve()
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    } catch (error) {
      reject(error)
    }
  })

onDOMReady()
  .then(init)
  .catch(payload => {
    window.Core.log(payload, 'error')
  })
