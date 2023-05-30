import { useCallback, useMemo } from 'react'

import { PageLayout } from '~/components/PageLayout'
import { useLyricsService } from '~/hooks/useLyricsService/useLyricsService'
import { useTrackService } from '~/hooks/useTrackService/useTrackService'

export const PageHome = () => {
  const { isConnected, connect } = useLyricsService()
  const { currentTrack } = useTrackService()

  const handleSignOut = () => {
    window.Auth.signOut()
  }

  const handleLyricsConnect = useCallback(() => {
    connect()
  }, [connect])

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

  const getLyricsWords = useMemo(() => {
    const words = currentTrack?.lyrics?.lines.map(line => {
      return line.words
    })

    return words
  }, [currentTrack])

  return (
    <PageLayout>
      <div className='headline'>Welcome</div>
      <button onClick={handleSignOut} className='button-primary'>
        Sign out
      </button>
      <div className='text-gray-300'>Lyrics status: {lyricsStatusContent}</div>
      <div className='text-white text-center flex flex-col overflow-y-scroll shadow-inner gap-1 w-full'>
        {getLyricsWords?.map((word, idx) => (
          <div key={`${idx}_${word}`}>{word}</div>
        ))}
      </div>
    </PageLayout>
  )
}
