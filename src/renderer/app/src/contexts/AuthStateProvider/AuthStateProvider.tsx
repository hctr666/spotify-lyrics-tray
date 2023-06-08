import { PropsWithChildren, useEffect, useState } from 'react'

import { AuthStateContext } from './AuthStateContext'

export const AuthStateProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const _isAuthenticated = localStorage.getItem('authenticated')
    return !!_isAuthenticated
  })

  useEffect(() => {
    const unsubscribe = window.Auth.subscribe((_event, state) => {
      window.Core.log(JSON.stringify({ source: 'renderer/app', state }), 'info')

      if (state.isAuthenticated) {
        localStorage.setItem('authenticated', '1')
      } else {
        localStorage.removeItem('authenticated')
      }

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
