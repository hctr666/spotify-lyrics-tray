import { useEffect, useMemo, useState } from 'react'
import { HiFastForward, HiPause, HiPlay, HiRewind } from 'react-icons/hi'
import { usePlaybackState } from '~/hooks/usePlaybackState'
import { Track } from '~/types/track'

export const Playback = () => {
  const { playbackState, hasNewTrack, updatePlaybackState } = usePlaybackState()
  const { deviceId, progress, isPlaying, trackId } = playbackState
  const [track, setTrack] = useState<Track>()

  const { trackName, artists, imageUrl } = useMemo(() => {
    const artists = track?.artists
      .map(a => a.name)
      .join(', ')
      .trim()

    const imageUrl = track?.album?.images?.[0].url
    const trackName = track?.name

    return { artists, imageUrl, trackName }
  }, [track])

  // TODO: move track state to a global provider
  useEffect(() => {
    window.Track.getTrack(trackId).then(setTrack)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (hasNewTrack) {
      window.Track.getTrack(trackId).then(setTrack)
    }
  }, [trackId, hasNewTrack])

  const handlePlayOrPauseClick = () => {
    if (isPlaying) {
      window.PlaybackState.pause(deviceId).then(() => {
        updatePlaybackState({ ...playbackState, isPlaying: false })
      })
    } else {
      window.PlaybackState.play(deviceId, progress).then(() => {
        updatePlaybackState({ ...playbackState, isPlaying: true })
      })
    }
  }

  const handleSkipToNextClick = () => {
    window.PlaybackState.skipToNext(deviceId)
  }

  const handleSkipToPreviousClick = () => {
    window.PlaybackState.skipToPrevious(deviceId)
  }

  return (
    <div className='playback-container'>
      {track && (
        <div className='playback-track'>
          <img
            className='flex-shrink-0'
            src={imageUrl}
            alt={trackName}
            width={32}
            height={32}
          />
          <div className='flex flex-col overflow-hidden'>
            <span className='playback-track-name'>{trackName}</span>
            <span className='playback-track-artist'>{artists}</span>
          </div>
        </div>
      )}
      <div className='playback-controls'>
        <button
          onClick={handleSkipToPreviousClick}
          className='text-gray-400 text-2xl hover:text-white'
        >
          <HiRewind />
        </button>
        <button
          onClick={handlePlayOrPauseClick}
          className='text-white text-4xl hover:text-purple-700'
        >
          {isPlaying ? <HiPause /> : <HiPlay />}
        </button>
        <button
          onClick={handleSkipToNextClick}
          className='text-gray-400 text-2xl hover:text-white'
        >
          <HiFastForward />
        </button>
      </div>
    </div>
  )
}
