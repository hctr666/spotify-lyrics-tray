import { PropsWithChildren, useEffect, useState } from 'react'

import { AuthStateContext } from './AuthStateContext'

export const AuthStateProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = window.Auth.subscribe((_event, state) => {
      window.Core.log(JSON.stringify({ source: 'renderer/app', state }), 'info')

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
