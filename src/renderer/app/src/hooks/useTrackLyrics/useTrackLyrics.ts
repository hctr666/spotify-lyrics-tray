import { useContext } from 'react'

import { TrackLyricsContext } from '~/contexts/TrackLyricsProvider/TrackLyricsContext'

export const useTrackLyrics = () => useContext(TrackLyricsContext)
