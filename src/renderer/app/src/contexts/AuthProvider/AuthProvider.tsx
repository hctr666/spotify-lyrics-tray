import { PropsWithChildren, useEffect, useState } from 'react'

import { AuthContext } from './AuthContext'

export const AuthProvider = ({ children }: PropsWithChildren) => {
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
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
