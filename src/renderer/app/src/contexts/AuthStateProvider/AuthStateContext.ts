import { createContext } from 'react'

export interface AuthState {
  isAuthenticated: boolean
}

export const AuthStateContext = createContext<AuthState>({
  isAuthenticated: false,
})
