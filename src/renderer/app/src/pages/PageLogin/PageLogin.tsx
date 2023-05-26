import { Navigate } from 'react-router-dom'

import { useAuthState } from '~/contexts/AuthStateProvider'
import { PageLayout } from '~/components/PageLayout'

export const PageLogin = () => {
  const authState = useAuthState()

  const handleSignIn = () => {
    window.Auth.signIn()
  }

  if (authState.isAuthenticated) {
    return <Navigate to='/' />
  }

  return (
    <PageLayout>
      <div className='headline'>Please sign in to enjoy the app</div>
      <button className='button-primary' onClick={handleSignIn}>
        Sign in
      </button>
    </PageLayout>
  )
}
