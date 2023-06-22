import { createContext } from 'react'

import { LyricsState } from '~/types/lyrics'

export const initialLyricsState = {
  error: '',
  isLoading: true,
}

export const LyricsContext = createContext<LyricsState>(initialLyricsState)
