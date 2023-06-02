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

  const { hasNewTrack, playbackState, updateProgress } = usePlaybackState()
  const trackId = playbackState?.trackId
  const progress = playbackState?.progress

  useEffect(() => {
    if (isConnected && trackId && hasNewTrack) {
      startElapsing()
      setIsLoading(true)
      window.Track.requestLyrics(trackId)
    }
  }, [isConnected, trackId, hasNewTrack, startElapsing])

  useEffect(() => {
    const unsubscribeOnLyrics = window.Track.subscribeOnLyrics(
      (_event, lyrics) => {
        if (typeof progress === 'number') {
          // eslint-disable-next-line no-console
          console.info('Lyrics fetch response time: ', getTime())

          // Add lyrics response time to align current progress
          updateProgress(progress + getTime())
        }
        setLyrics(lyrics)
        setIsLoading(false)
      }
    )

    return () => {
      unsubscribeOnLyrics()
    }
  }, [isConnected, progress, getTime, updateProgress])

  return (
    <TrackServiceContext.Provider value={{ lyrics, isLoading }}>
      {children}
    </TrackServiceContext.Provider>
  )
}
