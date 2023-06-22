import { PropsWithChildren, useCallback, useState } from 'react'

import { PlaybackState } from '~/types/playback'
import { PlaybackContext, initialPlaybackState } from './PlaybackContext'
import { usePlaybackStateSubscription } from './usePlaybackStateSubscription'

export const PlaybackProvider = ({ children }: PropsWithChildren) => {
  const [playbackState, setPlaybackState] =
    useState<PlaybackState>(initialPlaybackState)
  const [hasNewTrack, setHasNewTrack] = useState(false)
  const { trackId, progress, deviceId, isPlaying } = playbackState

  const updateProgress = useCallback(
    (_progress: number) => {
      setPlaybackState(
        state => ({ ...state, progress: _progress } as PlaybackState)
      )
    },
    [setPlaybackState]
  )

  const updatePlaybackState = useCallback(
    (newState: Partial<PlaybackState>) => {
      setPlaybackState(state => ({ ...state, ...newState } as PlaybackState))
    },
    [setPlaybackState]
  )

  const fetchPlaybackState = usePlaybackStateSubscription({
    onStateChange: (state: PlaybackState) => {
      setPlaybackState(state)
      setHasNewTrack(state.trackId !== trackId)

      // Making sure the progress keeps in sync,
      // it handles the case when player progress is changed mannually
      if (progress !== state.progress) {
        updateProgress(state.progress)
      }
    },
  })

  const playOrPause = useCallback(async () => {
    if (isPlaying) {
      await window.Playback.pause(deviceId)
    } else {
      await window.Playback.play(deviceId, progress)
    }
    setPlaybackState(state => ({ ...state, isPlaying: !isPlaying }))
  }, [deviceId, progress, isPlaying])

  const skipToNext = useCallback(async () => {
    await window.Playback.skipToNext(deviceId)
    await fetchPlaybackState()
  }, [deviceId, fetchPlaybackState])

  const skipToPrevious = useCallback(async () => {
    await window.Playback.skipToPrevious(deviceId)
    await fetchPlaybackState()
  }, [deviceId, fetchPlaybackState])

  return (
    <PlaybackContext.Provider
      value={{
        hasNewTrack,
        playbackState,
        fetchPlaybackState,
        playOrPause,
        skipToPrevious,
        skipToNext,
        updateProgress,
        updatePlaybackState,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  )
}
