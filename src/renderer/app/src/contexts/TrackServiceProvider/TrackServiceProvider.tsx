import { PropsWithChildren, useEffect, useState } from 'react'

import { useLyricsService } from '~/hooks/useLyricsService/useLyricsService'
import { usePlaybackState } from '~/hooks/usePlaybackState/usePlaybackState'
import type { Lyrics } from '~/types/track-service'
import { TrackServiceContext } from './TrackServiceContext'
import { useTimeElapsed } from '~/hooks/useTimeElapsed/useTimeElapsed'

export const TrackServiceProvider = ({ children }: PropsWithChildren) => {
  const [lyrics, setLyrics] = useState<Lyrics>()
  const [isLoading, setIsLoading] = useState(true)
  const { isConnected } = useLyricsService()
  const { startElapsing, getTime } = useTimeElapsed()

  const { playbackState, addToProgress } = usePlaybackState()
  const trackId = playbackState?.trackId

  useEffect(() => {
    if (isConnected && trackId) {
      startElapsing()
      setIsLoading(true)
      window.Track.requestLyrics(trackId)
    }
  }, [isConnected, trackId, startElapsing])

  useEffect(() => {
    const unsubscribeOnLyrics = window.Track.subscribeOnLyrics(
      (_event, lyrics) => {
        addToProgress(getTime())
        setLyrics(lyrics)
        setIsLoading(false)
      }
    )

    return () => {
      unsubscribeOnLyrics()
    }
  }, [isConnected, getTime, addToProgress])

  return (
    <TrackServiceContext.Provider value={{ lyrics, isLoading }}>
      {children}
    </TrackServiceContext.Provider>
  )
}
