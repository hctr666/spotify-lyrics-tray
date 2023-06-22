import { PropsWithChildren, useEffect, useMemo, useState } from 'react'

import { usePlayback } from '~/hooks/usePlayback/usePlayback'
import { Track, DisplayTrack } from '~/types/track'
import { TrackContext } from './TrackContext'

export const TrackProvider = ({ children }: PropsWithChildren) => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [track, setTrack] = useState<Track>()

  const { hasNewTrack, playbackState } = usePlayback()
  const { trackId } = playbackState

  const displayTrack: DisplayTrack = useMemo(() => {
    const artistName = track?.artists
      .map(a => a.name)
      .join(', ')
      .trim()

    const imageUrl = track?.album?.images?.[0].url
    const title = track?.name

    return { artistName, imageUrl, title }
  }, [track])

  useEffect(() => {
    if (trackId && hasNewTrack) {
      setIsLoading(true)

      window.Track.getTrack(trackId)
        .then(_track => {
          setTrack(_track)
          setError('')
        })
        .catch(_error => setError(_error))
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [trackId, hasNewTrack])

  const state = {
    error,
    isLoading,
    displayTrack,
  }

  return <TrackContext.Provider value={state}>{children}</TrackContext.Provider>
}
