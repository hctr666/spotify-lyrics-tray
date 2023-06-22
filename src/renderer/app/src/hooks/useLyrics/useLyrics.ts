import { useContext } from 'react'

import { LyricsContext } from '~/contexts/LyricsProvider/LyricsContext'

export const useLyrics = () => useContext(LyricsContext)
