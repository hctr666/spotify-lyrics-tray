import { useContext } from 'react'

import { LyricsServiceContext } from '~/contexts/LyricsServiceProvider/LyricsServiceContext'

export const useLyricsService = () => useContext(LyricsServiceContext)
