import { PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { PlaybackState } from '~/types/playback-state'
import { PlaybackStateContext } from './PlaybackStateContext'

const LocalPlaybackState = {
  getValue: () => {
    const value = localStorage.getItem('playback-state')

    if (!value) {
      return null
    }

    return JSON.parse(value) as PlaybackState
  },
  setValue: (value: PlaybackState) => {
    localStorage.setItem('playback-state', JSON.stringify(value))
  },
}

export const PlaybackStateProvider = ({ children }: PropsWithChildren) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(() =>
    LocalPlaybackState.getValue()
  )

  const getPlaybackState = useCallback(async () => {
    return await window.PlaybackState.getState()
  }, [])

  const addToProgress = useCallback(
    (time: number) => {
      setPlaybackState(
        state =>
          ({
            ...state,
            progress:
              typeof state?.progress === 'number'
                ? state?.progress + time
                : state?.progress,
          } as PlaybackState)
      )
    },
    [setPlaybackState]
  )

  useEffect(() => {
    window.PlaybackState.getState().then(state => {
      setPlaybackState(state)
    })

    const unsubscribe = window.PlaybackState.subscribeOnState(
      (_event, state) => {
        setPlaybackState(state)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <PlaybackStateContext.Provider
      value={{
        hasNewTrack: false,
        playbackState,
        addToProgress,
        getPlaybackState,
      }}
    >
      {children}
    </PlaybackStateContext.Provider>
  )
}
