import { PropsWithChildren, useEffect, useState } from 'react'

import { useLyricsService } from '~/hooks/useLyricsService/useLyricsService'
import { usePlaybackState } from '~/hooks/usePlaybackState/usePlaybackState'
import type { Lyrics } from '~/types/track-service'
import { TrackServiceContext } from './TrackServiceContext'
import { useTimeElapsed } from '~/hooks/useTimeElapsed/useTimeElapsed'

export const TrackServiceProvider = ({ children }: PropsWithChildren) => {
  const [lyrics, setLyrics] = useState<Lyrics>()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const lyricsService = useLyricsService()
  const { startElapsing, getTime } = useTimeElapsed()
  const { hasNewTrack, playbackState, updateProgress } = usePlaybackState()

  const trackId = playbackState?.trackId
  const progress = playbackState?.progress

  const isLyricsServiceConnected = lyricsService.isConnected
  const lyricsServiceError = lyricsService.error

  useEffect(() => {
    if (lyricsServiceError) {
      setError('Error in lyrics service')
      setIsLoading(false)
      return
    }

    if (isLyricsServiceConnected && trackId && hasNewTrack) {
      startElapsing()
      setIsLoading(true)
      window.Track.requestLyrics(trackId)
    }
  }, [
    isLyricsServiceConnected,
    trackId,
    hasNewTrack,
    lyricsServiceError,
    startElapsing,
  ])

  useEffect(() => {
    const unsubscribeOnLyrics = window.Track.subscribeOnLyrics(
      (_event, lyrics, _error) => {
        if (_error) {
          setError(_error)
          setLyrics(undefined)
        } else {
          if (typeof progress === 'number') {
            // eslint-disable-next-line no-console
            console.info('Lyrics fetch response time: ', getTime())

            // Add lyrics response time to align current progress
            updateProgress(progress + getTime())
          }

          setError('')
          setLyrics(lyrics)
        }
        setIsLoading(false)
      }
    )

    return () => {
      unsubscribeOnLyrics()
    }
  }, [progress, getTime, updateProgress])

  const state = {
    error,
    isLoading,
    lyrics,
  }

  return (
    <TrackServiceContext.Provider value={state}>
      {children}
    </TrackServiceContext.Provider>
  )
}
