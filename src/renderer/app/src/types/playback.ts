export interface PlaybackState {
  imageUrl: string
  isPlaying: boolean
  isInactive: boolean
  progress: number
  trackId: string
  deviceId: string
}

export interface PlaybackContextValue {
  hasNewTrack: boolean
  playbackState: PlaybackState
  fetchPlaybackState: () => Promise<void>
  playOrPause: () => Promise<void>
  skipToNext: () => Promise<void>
  skipToPrevious: () => Promise<void>
  updateProgress: (time: number) => void
  updatePlaybackState: (state: Partial<PlaybackState>) => void
}
