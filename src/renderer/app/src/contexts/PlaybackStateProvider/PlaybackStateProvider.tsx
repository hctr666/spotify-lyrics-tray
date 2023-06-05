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

  const handleStateResponse = useCallback(
    (state: PlaybackState) => {
      setPlaybackState(state)
      setHasNewTrack(state.trackId !== trackId)

      // Making sure the progress keeps in sync,
      // it handles the case when player progress is changed mannually
      if (progress !== state.progress) {
        updateProgress(state.progress)
      }
    },
    [trackId, progress, updateProgress]
  )

  useEffect(() => {
    window.PlaybackState.getState().then(state => {
      handleStateResponse(state)
    })

    const unsubscribe = window.PlaybackState.subscribeOnState(
      (_event, state) => {
        handleStateResponse(state)
      }
    )

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
