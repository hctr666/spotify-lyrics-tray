const { v4: uuid } = require('uuid')
const fetch = require('node-fetch')

const { API_URL } = require('../../constants/spotify')
const { REDIRECT_URI } = require('../../constants/spotify')

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

        return { retryAfter }
      }

      const data = await response.json()

      return { data }
    } catch (error) {
      return {
        error: 'Something went wrong with the api request',
      }
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
    // const { data, retryAfter } = await this.fetchWebApi(
    //   'v1/me/player?market=ES'
    // )

    // if (retryAfter && onRateLimitApplied) {
    //   return onRateLimitApplied(Number(retryAfter))
    // }

    // return data
    return null
  }
}

module.exports = new SpotifyClient()
