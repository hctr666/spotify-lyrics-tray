import { createContext } from 'react'

import { TrackContextValue } from '~/types/track'

export const TrackContext = createContext<TrackContextValue>({
  displayTrack: {},
})
