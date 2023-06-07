import { createContext } from 'react'

interface LyricsServiceContextValue {
  error: string
  isConnected: boolean
  isLoading: boolean
  connect: () => void
}

export const LyricsServiceContext = createContext<LyricsServiceContextValue>({
  error: '',
  isConnected: false,
  isLoading: true,
  connect() {},
})
