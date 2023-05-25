import { createContext, useContext } from 'react'

interface AuthState {
  isAuthenticated: boolean
}

export const AuthStateContext = createContext<AuthState>({
  isAuthenticated: false,
})

export const useAuthState = () => useContext(AuthStateContext)
