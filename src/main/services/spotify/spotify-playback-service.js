const { isDevelopment } = require('../../helpers/environment')
const { Emittable } = require('../../libs/emittable/emittable')
const { SpotifyClient } = require('../../libs/spotify-client')

class SpotifyPlaybackService extends Emittable {
  events = ['state-changed']
  retryAfter = isDevelopment() ? 6000 : 3000

  isChecking = false
  isPlaying = null
  trackId = null

  getState = async () => {
    // TODO: add retryAfter into the client response, remove callback
    const playbackState = await SpotifyClient.getPlaybackState({
      onRateLimitApplied: retryAfter => {
        this.retryAfter = retryAfter
      },
    })

    const isInactive =
      !playbackState || playbackState?.device?.is_private_session

    if (isInactive || playbackState?.currently_playing_type !== 'track') {
      return {
        isInactive,
        isPlaying: false,
      }
    }

    return {
      isInactive,
      isPlaying: playbackState.is_playing,
      trackId: playbackState.item?.id,
      progress: playbackState.progress_ms,
    }
  }

  async initStateCheck() {
    const handleStateChange = async () => {
      if (!this.isChecking) {
        return
      }

      const state = await this.getState()

      if (
        state.isPlaying !== this.isPlaying ||
        state.isInactive !== this.isInactive ||
        state.trackId !== this.trackId
      ) {
        this.emit('state-changed', state)

        this.isInactive = state.isInactive
        this.isPlaying = state.isPlaying
        this.trackId = state.trackId
      }
    }

    this.isChecking = true

    if (this.timer) return

    await handleStateChange()

    this.timer = setInterval(await handleStateChange, this.retryAfter)
  }

  stopStateCheck() {
    this.isChecking = false
  }

  abortStateCheck() {
    clearInterval(this.timer)
    this.timer = null
  }
}

module.exports = {
  SpotifyPlaybackService,
}
