import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useLyricsServiceState } from '~/hooks/useLyricsServiceState/useLyricsServiceState'

export const LyricsDependantPage = ({ page }: { page: ReactElement }) => {
  const { isConnected } = useLyricsServiceState()

  if (!isConnected) {
    return <Navigate to='/settings' />
  }

  return page
}
