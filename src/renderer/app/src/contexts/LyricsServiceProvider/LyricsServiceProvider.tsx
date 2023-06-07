import { PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { LyricsServiceContext } from './LyricsServiceContext'
import { useToastError } from '~/hooks/useToastError'
import { useNavigate } from 'react-router-dom'
import { LyricsServiceStatus } from '~/types/lyrics-service'

export const LyricsServiceProvider = ({ children }: PropsWithChildren) => {
  const [error, setError] = useState('')
  const [status, setStatus] = useState<LyricsServiceStatus>('loading')

  const navigate = useNavigate()
  const toastError = useToastError()

  const connect = useCallback(() => {
    window.LyricsService.connect()
  }, [])

  useEffect(() => {
    window.LyricsService.requestServiceState()

    const unsubscribeOnServiceState =
      window.LyricsService.subscribeOnServiceState((_event, state) => {
        setStatus(state.status)

        if (state.error) {
          setError(state.error)
          toastError('state-error-toast', state.error)
        } else {
          setError('')
        }

        navigate(
          ['disconnected', 'error'].includes(state.status) ? '/settings' : '/'
        )
      })

    return () => {
      unsubscribeOnServiceState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const state = {
    isConnected: status === 'connected',
    isLoading: status === 'loading',
    error,
    connect,
  }

  return (
    <LyricsServiceContext.Provider value={state}>
      {children}
    </LyricsServiceContext.Provider>
  )
}
