import { Navigate } from 'react-router-dom'

import { Page } from '~/components'
import { useAuthState } from '~/hooks/useAuthState/useAuthState'

export const PageLogin = () => {
  const authState = useAuthState()

  const handleSignIn = () => {
    window.Auth.signIn()
  }

  if (authState.isAuthenticated) {
    return <Navigate to='/' />
  }

  return (
    <Page>
      <Page.Content noHeader>
        <div className='flex flex-col gap-4 h-full items-center justify-center w-full relative'>
          <div className='headline'>Please sign in to enjoy the app</div>
          <button className='button-primary' onClick={handleSignIn}>
            Sign in
          </button>
        </div>
      </Page.Content>
    </Page>
  )
}
