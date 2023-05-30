import { PropsWithChildren, useEffect, useState } from 'react'

import { TrackServiceContext } from './TrackServiceContext'
import { Track } from '~/types/track-service'
import { useLyricsService } from '~/hooks/useLyricsService/useLyricsService'

const CURRENT_TRACK_KEY = 'current-track'

const getInitialCurrentTrack = () => {
  const currentTrack = localStorage.getItem(CURRENT_TRACK_KEY)
  return currentTrack ? JSON.parse(currentTrack) : null
}

export const TrackServiceProvider = ({ children }: PropsWithChildren) => {
  const [currentTrack, setCurrentTrack] = useState<Track>(
    getInitialCurrentTrack
  )

  const { isConnected } = useLyricsService()

  useEffect(() => {
    if (isConnected) {
      window.Track.requestCurrentTrack()
    }

    const unsubscribeCurrentTrack = window.Track.subscribeOnCurrentTrack(
      (_event, track) => {
        localStorage.setItem(CURRENT_TRACK_KEY, JSON.stringify(track))
        setCurrentTrack(track)
      }
    )

    return () => {
      unsubscribeCurrentTrack()
    }
  }, [isConnected])

  return (
    <TrackServiceContext.Provider value={{ currentTrack }}>
      {children}
    </TrackServiceContext.Provider>
  )
}
