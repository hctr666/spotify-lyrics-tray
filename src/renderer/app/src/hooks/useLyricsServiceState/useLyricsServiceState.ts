import { useContext } from 'react'

import { LyricsServiceStateContext } from '~/contexts/LyricsServiceStateProvider/LyricsServiceStateContext'

export const useLyricsServiceState = () => useContext(LyricsServiceStateContext)
