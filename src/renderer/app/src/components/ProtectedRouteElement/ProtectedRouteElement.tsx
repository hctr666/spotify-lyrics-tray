import { Navigate } from 'react-router-dom'
import { useAuth } from '~/hooks/useAuth/useAuth'

export const ProtectedRouteElement = ({
  element,
}: {
  element: JSX.Element
}) => {
  const { isAuthenticated } = useAuth()
  const fallbackElement = <Navigate to='/login' />

  if (!isAuthenticated) {
    return fallbackElement
  }

  return element
}
