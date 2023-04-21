// TODO: consider PKCE implementation for more security
// TODO: Move secrets to .env

const { BaseService } = require('../base')
const SafeStore = require('../../libs/safe-store')
const { REDIRECT_URI } = require('../../constants/spotify')
const { SpotifyClient } = require('../../libs/spotify-client/')
const { getUrlSearchParams } = require('../../helpers/getUrlSearchParams')

const CLIENT_ID = 'a92f1695d1dc47059c7397cd93d381ed'
const CLIENT_SECRET = '34d7045f3b0145bc9c0e19465eab8941'
const AUTH_TOKEN_ID = 'spm:auth-token'

class AuthService extends BaseService {
  constructor() {
    super()
    this.safeStore = new SafeStore()

    this.spotifyClient = new SpotifyClient({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      redirectURI: REDIRECT_URI,
    })

    this.events = ['logout']
  }

  accessToken = null
  refreshToken = null
  tokenType = null

  getAuthUrl = () => {
    return this.spotifyClient.getAuthorizeUrl(
      'user-read-private user-read-email'
    )
  }

  isAuthenticated = () => {
    if (this.refreshToken) {
      return true
    }

    try {
      const authToken = this.safeStore.getPassword(AUTH_TOKEN_ID)
      return !!authToken
    } catch (_) {
      return false
    }
  }

  logout = () => {
    this.safeStore.deletePassword(AUTH_TOKEN_ID)
    this.accessToken = null
    this.refreshToken = null

    this.eventEmitter.emit('logout')
  }

  requestRefreshToken = async () => {
    const authToken = this.safeStore.getPassword(AUTH_TOKEN_ID)

    if (authToken) {
      try {
        const data = await this.spotifyClient.getRefreshToken(authToken)

        this.accessToken = data.access_token
        this.tokenType = data.token_type
      } catch (error) {
        this.logout()
        throw new Error(error)
      }
    }
  }

  requestAccessToken = async callbackUrl => {
    try {
      const params = getUrlSearchParams(callbackUrl)
      const code = params.get('code')

      const data = await this.spotifyClient.getAccessToken(code)

      this.accessToken = data.access_token
      this.tokenType = data.token_type
      this.refreshToken = data.refresh_token

      if (this.refreshToken) {
        this.safeStore.setPassword(AUTH_TOKEN_ID, this.refreshToken)
      }
    } catch (error) {
      this.logout()
      throw new Error(error)
    }
  }
}

module.exports = {
  AuthService,
}
