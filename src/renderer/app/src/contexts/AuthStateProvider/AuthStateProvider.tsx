// @ts-nocheck
import { PropsWithChildren, useEffect, useState } from 'react'
import { AuthStateContext } from './AuthStateContext'

export const AuthStateProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState()

  useEffect(() => {
    const listener = (_event, state) => {
      window.Core.log({ ctx: 'app:renderer', state })

      setIsAuthenticated(state.isAuthenticated)
    }

    const unsubscribe = window.Auth.subscribeOnAuthStateChange(listener)

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
