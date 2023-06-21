import { PropsWithChildren, useEffect, useState } from 'react'

import { useLyricsServiceState } from '~/hooks/useLyricsServiceState/useLyricsServiceState'
import { usePlaybackState } from '~/hooks/usePlaybackState/usePlaybackState'
import type { Lyrics, LyricsColors } from '~/types/track-lyrics'
import { TrackContext } from './TrackContext'
import { useTimeElapsed } from '~/hooks/useTimeElapsed/useTimeElapsed'

export const TrackProvider = ({ children }: PropsWithChildren) => {
  const [lyrics, setLyrics] = useState<Lyrics>()
  const [colors, setColors] = useState<LyricsColors>()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const lyricsServiceState = useLyricsServiceState()
  const { startElapsing, getTime } = useTimeElapsed()
  const { hasNewTrack, playbackState, updateProgress } = usePlaybackState()

  const trackId = playbackState.trackId
  const progress = playbackState.progress
  const imageUrl = playbackState.imageUrl

  const isLyricsServiceConnected = lyricsServiceState.isConnected
  const lyricsServiceError = lyricsServiceState.error

  useEffect(() => {
    if (lyricsServiceError) {
      setError('Error in lyrics service')
      setIsLoading(false)
      return
    }

    const shouldRequestLyrics =
      isLyricsServiceConnected && trackId && imageUrl && hasNewTrack

    if (shouldRequestLyrics) {
      startElapsing()
      setIsLoading(true)
      window.Track.requestLyrics(trackId, imageUrl)
    }
  }, [
    isLyricsServiceConnected,
    trackId,
    imageUrl,
    hasNewTrack,
    lyricsServiceError,
    startElapsing,
  ])

  useEffect(() => {
    const unsubscribeOnLyrics = window.Track.subscribeOnLyrics(
      (_event, { lyrics, colors }, _error) => {
        if (_error) {
          setError(_error)
          setLyrics(undefined)
          setColors(undefined)
        } else {
          if (typeof progress === 'number') {
            // eslint-disable-next-line no-console
            console.info('Lyrics fetch response time: ', getTime())

            // Add lyrics response time to align current progress
            updateProgress(progress + getTime())
          }

          setError('')
          setLyrics(lyrics)
          setColors(colors)
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
    colors,
  }

  return <TrackContext.Provider value={state}>{children}</TrackContext.Provider>
}
