import { PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { LyricsServiceContext } from './LyricsServiceContext'

const CONNECTED_FLAG_KEY = 'lyrics-connected'

export const LyricsServiceProvider = ({ children }: PropsWithChildren) => {
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    const _isConnected = localStorage.getItem(CONNECTED_FLAG_KEY)

    if (_isConnected) return true

    return false
  })

  const connect = useCallback(() => {
    window.Lyrics.connect()
  }, [])

  useEffect(() => {
    window.Lyrics.requestConnectionStatus()

    const unsubscribeOnConnectionStatus =
      window.Lyrics.subscribeOnConnectionStatus((_event, status) => {
        const _isConnected = status === 'connected'

        if (_isConnected) {
          localStorage.setItem(CONNECTED_FLAG_KEY, '1')
        } else {
          localStorage.removeItem(CONNECTED_FLAG_KEY)
        }

        setIsConnected(_isConnected)
        window.Core.log({ ctx: 'app:renderer', connectionStatus: status })
      })

    return () => {
      unsubscribeOnConnectionStatus()
    }
  }, [])

  return (
    <LyricsServiceContext.Provider value={{ isConnected, connect }}>
      {children}
    </LyricsServiceContext.Provider>
  )
}
