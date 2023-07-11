import { IMMEDIATELLY_SEND_SERVICE_STATE, ROOT_SELECTOR } from './constants'
import errors from './errors'
import { fetchTrackLyrics } from './utils/lyrics-api'
import { logError, logInfo } from './utils/log'
import { getAppData, login, logout } from './utils/page'
import { getComputedRGB, waitForElement } from './utils/core'
import { getLocalValue, removeLocalValue } from './utils/local-storage'

const sendServiceState = state => {
  window.SpotifyWeb.sendServiceState(state)
}

const sendTrackLyrics = (data, error = '') => {
  window.SpotifyWeb.sendTrackLyrics(data, error)
}

const getLyricsResponse = data => {
  return data
    ? {
        lyrics: {
          lines: data?.lyrics.lines,
          syncType: data?.lyrics.syncType,
        },
        colors: {
          text: getComputedRGB(data.colors.text),
          activeText: getComputedRGB(data.colors.highlightText),
          background: getComputedRGB(data.colors.background),
        },
      }
    : {}
}

function SpotifyInject() {
  const state = {
    status: 'loading',
    error: null,
  }

  const handleSubscribeOnStateRequest = state => {
    sendServiceState(state)
  }

  const handleSubscribeOnConnect = () => {
    login().catch(error => {
      logError(error.message)
      sendServiceState({
        status: 'error',
        error: errors.SERVICE_CONNECT_FAILED,
      })
    })
  }

  const handleSubscribeOnTrackLyrics = (_event, trackId, imageUrl) => {
    fetchTrackLyrics(trackId, imageUrl)
      .then(data => {
        const lyrics = getLyricsResponse(data)
        sendTrackLyrics(lyrics)
      })
      .catch(error => {
        logError(error.message)
        sendTrackLyrics({}, errors.LYRICS_FETCH_FAILED)

        // Logout when token sent is invalid
        if (error.message === errors.INVALID_TOKEN) {
          logout()
            .then(() => sendServiceState(state))
            .catch(logError)
        }
      })
  }

  const sendInitialServiceState = state => {
    if (state.status === 'connected') {
      sendServiceState(state)
    } else {
      sendServiceState({
        ...state,
        error: errors.SERVICE_CONNECT_FAILED,
      })
    }
    removeLocalValue(IMMEDIATELLY_SEND_SERVICE_STATE)
  }

  window.SpotifyWeb.subscribeOnStateRequest(() =>
    handleSubscribeOnStateRequest(state)
  )

  const initialize = async () => {
    try {
      await waitForElement(ROOT_SELECTOR)

      const { isLoggedIn } = getAppData()
      state.status = isLoggedIn ? 'connected' : 'disconnected'

      const shouldSendServiceState = getLocalValue(
        IMMEDIATELLY_SEND_SERVICE_STATE
      )

      logInfo(
        JSON.stringify({
          state: JSON.stringify(state),
          shouldSendServiceState,
        })
      )

      if (shouldSendServiceState) {
        sendInitialServiceState(state)
      }

      window.SpotifyWeb.subscribeOnConnect(handleSubscribeOnConnect)
      window.SpotifyWeb.subscribeOnTrackLyrics(handleSubscribeOnTrackLyrics)
    } catch (error) {
      state.error = errors.SERVICE_LOAD_ERROR
      state.status = 'error'

      logError(error.message)
    }
  }

  return initialize
}

;(async function () {
  const initialize = new SpotifyInject()
  await initialize()
})()
