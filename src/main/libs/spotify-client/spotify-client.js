const { v4: uuid } = require('uuid')
const fetch = require('node-fetch')

const { API_URL } = require('../../constants/spotify')
const { REDIRECT_URI } = require('../../constants/spotify')
const { isDevelopment } = require('../../helpers/environment')

const ACCOUNTS_DOMAIN = 'https://accounts.spotify.com'
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_SECRET
const TOO_MANY_REQUESTS_STATUS = 429

const fetchToken = async ({ body, headers }) => {
  const response = await fetch(`${ACCOUNTS_DOMAIN}/api/token`, {
    method: 'POST',
    body: new URLSearchParams(body).toString(),
    headers,
  })

  const data = await response.json()

  return data
}

const logError = (endpoint, error) => {
  // eslint-disable-next-line no-console
  console.error(
    '[application:main]: ',
    JSON.stringify({
      ctx: 'Spotify API',
      endpoint,
      error,
    })
  )
}

class SpotifyClient {
  constructor() {
    this.clientId = CLIENT_ID
    this.clientSecret = CLIENT_SECRET
    this.redirectURI = REDIRECT_URI

    this.tokenRequestHeaders = {
      Authorization: `Basic ${Buffer.from(
        `${this.clientId}:${this.clientSecret}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }

  fetchWebApi = async (endpoint, method = 'GET', body) => {
    try {
      /** @type {Response} */
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(body),
      })

      // if rate limiting has been applied, it returns retry seconds
      if (response.status === TOO_MANY_REQUESTS_STATUS) {
        const retryAfter = response.headers.get('Retry-After')

        logError(endpoint, {
          status: TOO_MANY_REQUESTS_STATUS,
          message: `Too many requests, rate limiting applied, will retry after ${retryAfter} seconds`,
        })

        return { retryAfter }
      }

      if (response.status === 500) {
        throw new Error(
          JSON.stringify({ status: 500, message: 'Server error' })
        )
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(JSON.stringify(data.error))
      }

      return { data }
    } catch (error) {
      logError(endpoint, error.message)
      return error
    }
  }

  getAuthorizeUrl = scope => {
    const state = uuid()
    const queryString = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectURI,
      state,
      scope,
    }).toString()

    return `${ACCOUNTS_DOMAIN}/authorize?${queryString}`
  }

  getRefreshToken = async refreshToken => {
    const token = await fetchToken({
      body: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      headers: this.tokenRequestHeaders,
    })

    return token
  }

  setAccessToken = accessToken => {
    this.accessToken = accessToken
  }

  /**
   * @param {String} code
   * @returns {{ access_token: String, refresh_token: String }}
   */
  getAccessToken = async code => {
    const token = await fetchToken({
      body: {
        grant_type: 'authorization_code',
        redirect_uri: this.redirectURI,
        code,
      },
      headers: this.tokenRequestHeaders,
    })

    return token
  }

  // TODO: keep commented until start with the lyrics view
  getPlaybackState = async ({ onRateLimitApplied } = {}) => {
    // TODO: create a playback api mock
    if (isDevelopment()) {
      const [
        mockData,
      ] = require('../../../../api-mocks/playback-state-mock.json') //FIXME

      return mockData
    }

    const { data, retryAfter } = await this.fetchWebApi(
      'v1/me/player?market=ES'
    )

    if (retryAfter && onRateLimitApplied) {
      return onRateLimitApplied(Number(retryAfter))
    }

    return data
  }
}

module.exports = new SpotifyClient()
