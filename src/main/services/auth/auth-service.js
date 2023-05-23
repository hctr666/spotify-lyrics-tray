// TODO: consider PKCE implementation for more security
const { BaseService } = require('../base')
const SafeStore = require('../../libs/safe-store')
const { SpotifyClient } = require('../../libs/spotify-client/')
const { getUrlSearchParams } = require('../../helpers/getUrlSearchParams')

const AUTH_TOKEN_ID = 'sla:auth-token'

class AuthService extends BaseService {
  constructor() {
    super()
    this.safeStore = new SafeStore()
    this.events = ['logout']
  }

  refreshToken = null

  getAuthUrl = () => {
    return SpotifyClient.getAuthorizeUrl('user-read-playback-state')
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
    this.refreshToken = null

    SpotifyClient.setAccessToken(null)

    this.emit('logout')
  }

  requestRefreshToken = async () => {
    const authToken = this.safeStore.getPassword(AUTH_TOKEN_ID)

    if (authToken) {
      try {
        const token = await SpotifyClient.getRefreshToken(authToken)

        SpotifyClient.setAccessToken(token.access_token)
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

      const token = await SpotifyClient.getAccessToken(code)

      this.refreshToken = token.refresh_token

      SpotifyClient.setAccessToken(token.access_token)

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
