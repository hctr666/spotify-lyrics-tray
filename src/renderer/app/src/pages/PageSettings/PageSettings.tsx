import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineX } from 'react-icons/hi'
import { FaPlug, FaCircle } from 'react-icons/fa'

import { Page } from '~/components'
import { useLyricsServiceState } from '~/hooks/useLyricsServiceState/useLyricsServiceState'

export const PageSettings = () => {
  const { isConnected } = useLyricsServiceState()
  const navigate = useNavigate()

  const handleSignOut = () => {
    window.Auth.signOut()
  }

  const handleLyricsConnect = useCallback(() => {
    window.LyricsService.connect()
  }, [])

  const handleCloseClick = () => {
    navigate('/')
  }

  const lyricsServiceStatusContent = useMemo(() => {
    if (isConnected) {
      return (
        <>
          <FaCircle className='text-green-600' size={12} />
          <span>Lyrics service: connected</span>
        </>
      )
    }

    return (
      <>
        <FaCircle className='text-red-600' size={12} />
        <span>Lyrics service: disconnected</span>
        <button
          title='Connect to service'
          className='hover:text-white'
          onClick={handleLyricsConnect}
        >
          <FaPlug />
        </button>
      </>
    )
  }, [isConnected, handleLyricsConnect])

  return (
    <Page>
      <div className='flex flex-col gap-4 h-full items-center justify-center w-full relative'>
        <button
          onClick={handleCloseClick}
          className='text-gray-300 text-2xl absolute top-3 right-2 font-extralight'
        >
          <HiOutlineX />
        </button>
        <div className='text-gray-300 flex items-center gap-2 text-sm'>
          {lyricsServiceStatusContent}
        </div>
        <button onClick={handleSignOut} className='button-primary'>
          Sign out
        </button>
      </div>
    </Page>
  )
}
