// TODO: consider PKCE implementation for more security
// TODO: implement Spotify SSO
import { BaseService } from '../base'
import { SafeStore } from '../../libs/safe-store'
import { SpotifyClient } from '../../libs/spotify-client/'
import { getUrlSearchParams } from '../../helpers/getUrlSearchParams'
import Logger from '../../libs/logger'

const AUTH_TOKEN_ID = 'sla:auth-token'

export class AuthService extends BaseService {
  constructor() {
    super()
    this.safeStore = new SafeStore()
    this.events = ['logout']
  }

  refreshToken = null

  getAuthUrl = () => {
    return SpotifyClient.getAuthorizeUrl(
      'user-read-playback-state user-modify-playback-state'
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
    try {
      this.safeStore.deletePassword(AUTH_TOKEN_ID)
      this.refreshToken = null

      SpotifyClient.setAccessToken(null)

      this.emit('logout')
    } catch (error) {
      Logger.logError(error)
    }
  }

  requestRefreshToken = async () => {
    try {
      const authToken = this.safeStore.getPassword(AUTH_TOKEN_ID)

      if (authToken) {
        const token = await SpotifyClient.getRefreshToken(authToken)

        SpotifyClient.setAccessToken(token.access_token)
      }
    } catch (error) {
      Logger.logError(error)
      this.logout()
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
      Logger.logError(error)
      this.logout()
    }
  }
}
