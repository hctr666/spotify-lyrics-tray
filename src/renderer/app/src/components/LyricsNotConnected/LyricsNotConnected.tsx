import { FaPlug } from 'react-icons/fa'

export const LyricsNotConnected = () => {
  const handleLyricsConnect = () => {
    window.LyricsService.connect()
  }

  return (
    <div className='flex items-center h-full justify-center flex-col gap-2 text-md'>
      <span className='block text-yellow-500'>
        Lyrics service is not connected
      </span>
      <button
        className='text-gray-300 flex items-center gap-1 hover:text-white'
        onClick={handleLyricsConnect}
      >
        <FaPlug />
        Connect
      </button>
    </div>
  )
}
