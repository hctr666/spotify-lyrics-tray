import { useCallback, useState } from 'react'

export const useTimeElapsed = () => {
  const [time, setTime] = useState(0)

  const startElapsing = useCallback(() => {
    setTime(Date.now())
  }, [])

  const getTime = useCallback(() => {
    return Date.now() - time
  }, [time])

  return { startElapsing, getTime }
}
