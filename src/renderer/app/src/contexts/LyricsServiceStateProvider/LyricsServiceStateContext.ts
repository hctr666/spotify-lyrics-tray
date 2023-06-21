import { createContext } from 'react'

interface LyricsServiceStateState {
  error: string
  isConnected: boolean
  isLoading: boolean
}

export const LyricsServiceStateContext = createContext<LyricsServiceStateState>(
  {
    error: '',
    isConnected: false,
    isLoading: true,
  }
)
