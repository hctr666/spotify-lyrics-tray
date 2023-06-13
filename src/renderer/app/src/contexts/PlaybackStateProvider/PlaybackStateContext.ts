import { createContext } from 'react'

import { PlaybackState } from '~/types/playback-state'

interface PlaybackStateContextValue {
  hasNewTrack: boolean
  playbackState: PlaybackState | null
  updateProgress: (time: number) => void
  getPlaybackState: () => Promise<PlaybackState>
}

export const PlaybackStateContext = createContext<PlaybackStateContextValue>({
  hasNewTrack: false,
  playbackState: null,
  updateProgress: () => {},
  getPlaybackState: () =>
    Promise.resolve({
      isPlaying: false,
      isInactive: true,
      progress: 0,
      trackId: '',
      imageUrl: '',
    }),
})
