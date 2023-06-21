import { PropsWithChildren, useEffect, useState } from 'react'

import { LyricsServiceStateContext } from './LyricsServiceStateContext'
import { useToastError } from '~/hooks/useToastError'
import { useNavigate } from 'react-router-dom'
import { LyricsServiceStatus } from '~/types/lyrics-service'

export const LyricsServiceStateProvider = ({ children }: PropsWithChildren) => {
  const [error, setError] = useState('')
  const [status, setStatus] = useState<LyricsServiceStatus>('loading')

  const navigate = useNavigate()
  const toastError = useToastError()

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
  }

  return (
    <LyricsServiceStateContext.Provider value={state}>
      {children}
    </LyricsServiceStateContext.Provider>
  )
}
