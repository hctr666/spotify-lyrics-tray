import { useContext } from 'react'

import { TrackContext } from '~/contexts/TrackProvider/TrackContext'

export const useTrackLyrics = () => useContext(TrackContext)
