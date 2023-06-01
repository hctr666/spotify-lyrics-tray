import { PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { LyricsServiceContext } from './LyricsServiceContext'
import { useAuthState } from '~/hooks/useAuthState/useAuthState'

const CONNECTED_FLAG_KEY = 'lyrics-connected'

export const LyricsServiceProvider = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuthState()
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    const _isConnected = localStorage.getItem(CONNECTED_FLAG_KEY)

    if (isAuthenticated && _isConnected) return true

    return false
  })

  const connect = useCallback(() => {
    window.LyricsService.connect()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    window.LyricsService.requestConnectionStatus()

    const unsubscribeOnConnectionStatus =
      window.LyricsService.subscribeOnConnectionStatus((_event, status) => {
        const _isConnected = isAuthenticated && status === 'connected'

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
  }, [isAuthenticated])

  return (
    <LyricsServiceContext.Provider value={{ isConnected, connect }}>
      {children}
    </LyricsServiceContext.Provider>
  )
}
