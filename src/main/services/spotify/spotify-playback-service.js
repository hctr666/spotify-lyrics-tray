const { Emittable } = require('../../libs/emittable/emittable')
const { SpotifyClient } = require('../../libs/spotify-client')

class SpotifyPlaybackService extends Emittable {
  constructor() {
    super()
  }

  events = ['state-changed']
  retryAfter = 3000

  trackId = null
  isChecking = false
  isPlaying = null

  #getState = async () => {
    const playbackState = await SpotifyClient.getPlaybackState({
      onRateLimitApplied: retryAfter => {
        console.log(`rate limiting applied, retry after: ${retryAfter} seconds`)

        this.retryAfter = retryAfter
      },
    })

    if (
      !playbackState ||
      playbackState?.currently_playing_type !== 'track' ||
      playbackState?.device?.is_private_session
    ) {
      return {
        isPlaying: false,
      }
    }

    return {
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

      const state = await this.#getState()

      if (
        state.isPlaying !== this.isPlaying ||
        state.trackId !== this.trackId
      ) {
        this.emit('state-changed', state)
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
