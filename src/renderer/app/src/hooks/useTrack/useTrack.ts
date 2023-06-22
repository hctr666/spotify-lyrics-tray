import { useContext } from 'react'

import { TrackContext } from '~/contexts/TrackProvider/TrackContext'

export const useTrack = () => useContext(TrackContext)
