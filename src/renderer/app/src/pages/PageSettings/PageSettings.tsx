import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineX } from 'react-icons/hi'

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

  const lyricsStatusContent = useMemo(() => {
    if (isConnected) {
      return <span className='text-green-600'>Connected</span>
    }

    return (
      <button className='button' onClick={handleLyricsConnect}>
        Connect
      </button>
    )
  }, [isConnected, handleLyricsConnect])

  return (
    <Page>
      <div className='flex flex-col gap-4 h-full items-center justify-center w-full relative'>
        {isConnected && (
          <button
            onClick={handleCloseClick}
            className='text-gray-300 text-2xl absolute top-3 right-2 font-extralight'
          >
            <HiOutlineX />
          </button>
        )}
        <button onClick={handleSignOut} className='button-primary'>
          Sign out
        </button>
        <div className='text-gray-300'>
          Lyrics service status: {lyricsStatusContent}
        </div>
      </div>
    </Page>
  )
}
