import { PropsWithChildren, useEffect, useState } from 'react'

import { useLyricsServiceState } from '~/hooks/useLyricsServiceState/useLyricsServiceState'
import { usePlayback } from '~/hooks/usePlayback/usePlayback'
import { LyricsState } from '~/types/lyrics'
import { useTimeElapsed } from '~/hooks/useTimeElapsed/useTimeElapsed'
import { LyricsContext, initialLyricsState } from './LyricsContext'

export const LyricsProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<LyricsState>(initialLyricsState)
  const { isConnected, error: lyricsServiceError } = useLyricsServiceState()
  const { startElapsing, getTime } = useTimeElapsed()
  const { hasNewTrack, playbackState, updateProgress } = usePlayback()

  const { trackId, progress, imageUrl } = playbackState

  useEffect(() => {
    if (lyricsServiceError) {
      setState(prevState => ({
        ...prevState,
        error: 'Error in lyrics service',
        isLoading: false,
      }))
      return
    }

    if (isConnected && hasNewTrack && imageUrl) {
      startElapsing()
      setState(prevState => ({ ...prevState, isLoading: true }))
      window.Track.requestLyrics(trackId, imageUrl)
    }
  }, [
    imageUrl,
    isConnected,
    hasNewTrack,
    lyricsServiceError,
    trackId,
    startElapsing,
  ])

  useEffect(() => {
    const unsubscribeOnLyrics = window.Track.subscribeOnLyrics(
      (_event, { lyrics, colors }, error) => {
        if (!error) {
          // eslint-disable-next-line no-console
          console.info('Lyrics fetch response time: ', getTime())

          // Add lyrics response time to align current progress
          updateProgress(progress + getTime())
        }

        setState({ lyrics, colors, error, isLoading: false })
      }
    )

    return () => {
      unsubscribeOnLyrics()
    }
  }, [progress, getTime, updateProgress])

  return (
    <LyricsContext.Provider value={state}>{children}</LyricsContext.Provider>
  )
}
