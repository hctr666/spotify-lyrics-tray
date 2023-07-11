import { createContext } from 'react'

import { PlaybackContextValue } from '~/types/playback'

export const initialPlaybackState = {
  isPlaying: false,
  isInactive: false,
  progress: 0,
  trackId: '',
  imageUrl: '',
  deviceId: '',
}

export const PlaybackContext = createContext<PlaybackContextValue>({
  hasNewTrack: false,
  playbackState: initialPlaybackState,
  fetchPlaybackState: () => Promise.resolve(),
  playOrPause: () => Promise.resolve(),
  skipToNext: () => Promise.resolve(),
  skipToPrevious: () => Promise.resolve(),
  updateProgress: () => {
    console.error(
      'Using PlaybackContext without PlaybackProvider is forbidden!'
    )
  },
  updatePlaybackState: () => {
    console.error(
      'Using PlaybackContext without PlaybackProvider is forbidden!'
    )
  },
})
