import { createContext } from 'react'

export interface AuthState {
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
})
