import { Navigate } from 'react-router-dom'

import { useAuth } from '~/hooks/useAuth/useAuth'
import { PageCompound as Page } from '~/components/PageCompound/PageCompound'

export const ProtectedRouteElement = ({
  element,
}: {
  element: JSX.Element
}) => {
  const { isAuthenticated, isLoading } = useAuth()
  const fallbackElement = <Navigate to='/login' />

  if (isLoading) {
    return (
      <Page>
        <Page.Content noHeader>
          <span className='text-white h-full flex items-center justify-center'>
            Loading...
          </span>
        </Page.Content>
      </Page>
    )
  }

  if (!isAuthenticated) {
    return fallbackElement
  }

  return element
}
