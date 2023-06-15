import { HiFastForward, HiPlay, HiRewind } from 'react-icons/hi'

export const Playback = () => {
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
        <button className='text-white text-4xl hover:text-purple-700'>
          <HiPlay />
        </button>
        <button className='text-gray-400 text-2xl hover:text-white'>
          <HiFastForward />
        </button>
      </div>
    </div>
  )
}
