const { v4: uuid } = require('uuid')
const fetch = require('node-fetch')

const ACCOUNTS_DOMAIN = 'https://accounts.spotify.com'

const fetchToken = async ({ body, headers }) => {
  console.log(JSON.stringify(body))
  console.log(JSON.stringify(headers))
  const response = await fetch(`${ACCOUNTS_DOMAIN}/api/token`, {
    method: 'POST',
    body: new URLSearchParams(body).toString(),
    headers,
  })

  const data = await response.json()

  return data
}

class SpotifyClient {
  constructor(options) {
    this.clientId = options.clientId
    this.clientSecret = options.clientSecret
    this.redirectURI = options.redirectURI

    this.headers = {
      Authorization: `Basic ${Buffer.from(
        `${options.clientId}:${options.clientSecret}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
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
    const tokenData = await fetchToken({
      body: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      headers: this.headers,
    })

    return tokenData
  }

  getAccessToken = async code => {
    const tokenData = await fetchToken({
      body: {
        grant_type: 'authorization_code',
        redirect_uri: this.redirectURI,
        code,
      },
      headers: this.headers,
    })

    return tokenData
  }
}

module.exports = {
  SpotifyClient,
}
