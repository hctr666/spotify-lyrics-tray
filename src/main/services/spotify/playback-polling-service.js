const { Emittable } = require('../../libs/emittable/emittable')
const { SpotifyClient } = require('../../libs/spotify-client')

const areObjectsEqual = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

const RETRY_AFTER = 10000

class SpotifyPlaybackPollingService extends Emittable {
  events = ['state-changed']
  retryAfter = RETRY_AFTER
  isChecking = false

  state = {
    isPlaying: false,
    isInactive: false,
    trackId: '',
    progress: 0,
  }

  getState = async () => {
    const { playbackState, retryAfter } = await SpotifyClient.getPlaybackState()

    // When rate limiting has been applied,
    // reset state check interval and use returned retryAfter value
    if (retryAfter && retryAfter !== this.retryAfter) {
      this.retryAfter = retryAfter
      this.abortStateCheck()
      this.initStateCheck()
    }

    // Note: private session flag returns false even when is switched off,
    // until a playback action is triggered such play/pause next/prev...
    // TODO: consider to add a reload button in the UI
    const isInactive =
      !playbackState || playbackState?.device?.is_private_session

    const isTrack = playbackState?.currently_playing_type === 'track'
    const isPlaying = isInactive ? false : playbackState.is_playing
    const trackId = isInactive || !isTrack ? '' : playbackState.item?.id
    const progress = isInactive || !isTrack ? 0 : playbackState.progress_ms
    const imageUrl = playbackState?.item?.album?.images?.[0].url
    const deviceId = playbackState?.device?.id

    return {
      isInactive,
      isPlaying,
      trackId,
      progress,
      imageUrl,
      deviceId,
    }
  }

  async initStateCheck() {
    const handleStateChange = async () => {
      if (!this.isChecking) {
        return
      }

      const state = await this.getState()
      const hasStateChanged = !areObjectsEqual(this.state, state)

      if (hasStateChanged) {
        this.emit('state-changed', state)
        this.state = state
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
  SpotifyPlaybackPollingService,
}
