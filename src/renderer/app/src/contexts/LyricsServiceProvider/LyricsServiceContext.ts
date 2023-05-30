import { createContext } from 'react'

interface LyricsServiceState {
  isConnected: boolean
  connect: () => void
}

export const LyricsServiceContext = createContext<LyricsServiceState>({
  isConnected: false,
  connect() {},
})
