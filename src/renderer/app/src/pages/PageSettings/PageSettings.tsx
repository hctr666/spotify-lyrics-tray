import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Page } from '~/components'
import { useLyricsService } from '~/hooks/useLyricsService/useLyricsService'

export const PageSettings = () => {
  const { isConnected, connect } = useLyricsService()
  const navigate = useNavigate()

  const handleSignOut = () => {
    window.Auth.signOut()
  }

  const handleLyricsConnect = useCallback(() => {
    connect()
  }, [connect])

  const handleCloseClick = () => {
    navigate('/home')
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
        <button
          onClick={handleCloseClick}
          className='text-purple-400 text-2xl absolute top-1 right-4 font-extralight'
        >
          x
        </button>
        <button onClick={handleSignOut} className='button-primary'>
          Sign out
        </button>
        <div className='text-gray-300'>
          Lyrics status: {lyricsStatusContent}
        </div>
      </div>
    </Page>
  )
}
