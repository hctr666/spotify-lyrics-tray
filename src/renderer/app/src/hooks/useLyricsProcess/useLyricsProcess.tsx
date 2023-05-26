import { useCallback, useEffect, useState } from 'react'
import type { LyricsProcessStatus } from './types'

const STATUS_LS_KEY = 'lyrics-connection-status'

export const useLyricsProcess = () => {
  const [status, setStatus] = useState<'checking' | LyricsProcessStatus>(() => {
    const defaultStatus = 'checking'
    const status = localStorage.getItem(STATUS_LS_KEY) as LyricsProcessStatus

    return status || defaultStatus
  })

  const connect = useCallback(() => {
    window.LyricsProcess.connect()
  }, [])

  useEffect(() => {
    const unsubscribe = window.LyricsProcess.subscribe((_event, status) => {
      localStorage.setItem(STATUS_LS_KEY, status)
      setStatus(status)

      window.Core.log({ ctx: 'app:renderer', status })

      return () => {
        unsubscribe()
      }
    })
  }, [setStatus])

  return { status, connect }
}
