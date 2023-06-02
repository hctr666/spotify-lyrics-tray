import { PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { PlaybackState } from '~/types/playback-state'
import { PlaybackStateContext } from './PlaybackStateContext'

export const PlaybackStateProvider = ({ children }: PropsWithChildren) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    () => {
      const value = localStorage.getItem('playback-state')

      if (!value) {
        return null
      }

      return JSON.parse(value) as PlaybackState
    }
  )
  const [hasNewTrack, setHasNewTrack] = useState(false)
  const trackId = playbackState?.trackId
  const progress = playbackState?.progress

  const getPlaybackState = useCallback(async () => {
    return await window.PlaybackState.getState()
  }, [])

  const updateProgress = useCallback(
    (_progress: number) => {
      setPlaybackState(
        state => ({ ...state, progress: _progress } as PlaybackState)
      )
    },
    [setPlaybackState]
  )

  useEffect(() => {
    const handleStateResponse = (state: PlaybackState) => {
      setPlaybackState(state)
      setHasNewTrack(state.trackId !== trackId)

      // Making sure the progress keeps in sync,
      // it handles the case when player progress is changed mannually
      if (progress !== state.progress) {
        updateProgress(state.progress)
      }
    }

    window.PlaybackState.getState().then(handleStateResponse)

    const unsubscribe = window.PlaybackState.subscribeOnState(
      (_event, state) => {
        handleStateResponse(state)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [trackId, progress, updateProgress])

  return (
    <PlaybackStateContext.Provider
      value={{
        hasNewTrack,
        playbackState,
        updateProgress,
        getPlaybackState,
      }}
    >
      {children}
    </PlaybackStateContext.Provider>
  )
}
