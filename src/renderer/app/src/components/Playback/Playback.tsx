import { HiFastForward, HiPause, HiPlay, HiRewind } from 'react-icons/hi'
import { usePlaybackState } from '~/hooks/usePlaybackState'

export const Playback = () => {
  const { playbackState, updatePlaybackState } = usePlaybackState()
  const { deviceId, progress, isPlaying } = playbackState

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

  return (
    <div className='playback-container'>
      <div className='playback-track'>
        <img className='flex-shrink-0' alt='' width={32} height={32} />
        <div className='flex flex-col overflow-hidden'>
          <span className='playback-track-name'>People = shit</span>
          <span className='playback-track-artist'>Slipknot</span>
        </div>
      </div>
      <div className='playback-controls'>
        <button className='text-gray-400 text-2xl hover:text-white'>
          <HiRewind />
        </button>
        <button
          onClick={handlePlayOrPauseClick}
          className='text-white text-4xl hover:text-purple-700'
        >
          {isPlaying ? <HiPause /> : <HiPlay />}
        </button>
        <button className='text-gray-400 text-2xl hover:text-white'>
          <HiFastForward />
        </button>
      </div>
    </div>
  )
}
