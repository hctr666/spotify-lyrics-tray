import { useCallback, useMemo } from 'react'

import { PageLayout } from '~/components/PageLayout'
import { useLyricsProcess } from '~/hooks/useLyricsProcess'

export const PageHome = () => {
  const { status: lyricsStatus, connect } = useLyricsProcess()

  const handleSignOut = () => {
    window.Auth.signOut()
  }

  const handleLyricsConnect = useCallback(() => {
    connect()
  }, [connect])

  const lyricsStatusContent = useMemo(() => {
    if (lyricsStatus === 'connected') {
      return <span className='text-green-600'>Connected</span>
    }

    if (lyricsStatus === 'disconnected') {
      return (
        <button className='button' onClick={handleLyricsConnect}>
          Connect
        </button>
      )
    }

    return `checking...`
  }, [lyricsStatus, handleLyricsConnect])

  return (
    <PageLayout>
      <div className='headline'>Welcome</div>
      <button onClick={handleSignOut} className='button-primary'>
        Sign out
      </button>
      <div className='text-gray-300'>Lyrics status: {lyricsStatusContent}</div>
    </PageLayout>
  )
}
