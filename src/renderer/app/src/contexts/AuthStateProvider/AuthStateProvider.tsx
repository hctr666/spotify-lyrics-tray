import { PropsWithChildren, useEffect, useState } from 'react'

import { AuthStateContext } from './AuthStateContext'

export const AuthStateProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = window.Auth.subscribe((_event, state) => {
      window.Core.log({ ctx: 'app:renderer', state })
      setIsAuthenticated(state.isAuthenticated)
    })

    return () => {
      unsubscribe()
    }
  }, [setIsAuthenticated])

  return (
    <AuthStateContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthStateContext.Provider>
  )
}
