import { HiFastForward, HiPause, HiPlay, HiRewind } from 'react-icons/hi'

import { usePlayback } from '~/hooks/usePlayback'
import { useTrack } from '~/hooks/useTrack/useTrack'

export const Playback = () => {
  const { playbackState, playOrPause, skipToNext, skipToPrevious } =
    usePlayback()
  const { displayTrack } = useTrack()

  const { title, artistName, imageUrl } = displayTrack

  return (
    <div className='playback-container'>
      <div className='playback-track'>
        <img
          className='flex-shrink-0'
          src={imageUrl}
          alt={title}
          width={32}
          height={32}
        />
        <div className='flex flex-col overflow-hidden'>
          <span className='playback-track-name'>{title}</span>
          <span className='playback-track-artist'>{artistName}</span>
        </div>
      </div>
      <div className='playback-controls'>
        <button
          onClick={skipToPrevious}
          className='text-gray-400 text-2xl hover:text-white'
        >
          <HiRewind />
        </button>
        <button
          onClick={playOrPause}
          className='text-white text-4xl hover:text-purple-700'
        >
          {playbackState.isPlaying ? <HiPause /> : <HiPlay />}
        </button>
        <button
          onClick={skipToNext}
          className='text-gray-400 text-2xl hover:text-white'
        >
          <HiFastForward />
        </button>
      </div>
    </div>
  )
}
