import { Navigate } from 'react-router-dom'
import { useAuthState } from '~/hooks/useAuthState/useAuthState'

export const ProtectedRouteElement = ({
  element,
}: {
  element: JSX.Element
}) => {
  const { isAuthenticated } = useAuthState()
  const fallbackElement = <Navigate to='/login' />

  if (!isAuthenticated) {
    return fallbackElement
  }

  return element
}
