import { createContext } from 'react'

import { TrackLyricsState } from '~/types/track-lyrics'

export const TrackLyricsContext = createContext<TrackLyricsState>({})
