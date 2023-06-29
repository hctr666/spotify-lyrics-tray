import { createContext } from 'react'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  isLoading: true,
})
