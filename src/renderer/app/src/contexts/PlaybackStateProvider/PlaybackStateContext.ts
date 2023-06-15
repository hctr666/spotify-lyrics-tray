import { createContext } from 'react'

import { PlaybackState } from '~/types/playback-state'

interface PlaybackStateContextValue {
  hasNewTrack: boolean
  playbackState: PlaybackState
  updateProgress: (time: number) => void
  getPlaybackState: () => Promise<PlaybackState>
  updatePlaybackState: (state: PlaybackState) => void
}

export const initialPlaybackState = {
  isPlaying: false,
  isInactive: true,
  progress: 0,
  trackId: '',
  imageUrl: '',
  deviceId: '',
}

export const PlaybackStateContext = createContext<PlaybackStateContextValue>({
  hasNewTrack: false,
  playbackState: initialPlaybackState,
  updateProgress: () => {},
  updatePlaybackState: () => {},
  getPlaybackState: () => Promise.resolve(initialPlaybackState),
})
