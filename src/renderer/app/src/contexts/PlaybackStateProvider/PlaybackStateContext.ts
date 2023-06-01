import { createContext } from 'react'

import { PlaybackState } from '~/types/playback-state'

interface PlaybackStateContextValue {
  hasNewTrack: boolean
  playbackState: PlaybackState | null
  addToProgress: (time: number) => void
  getPlaybackState: () => Promise<PlaybackState>
}

export const PlaybackStateContext = createContext<PlaybackStateContextValue>({
  playbackState: null,
  hasNewTrack: true,
  addToProgress: () => {},
  getPlaybackState: () =>
    Promise.resolve({
      isPlaying: false,
      isInactive: true,
      progress: 0,
      trackId: '',
    }),
})
