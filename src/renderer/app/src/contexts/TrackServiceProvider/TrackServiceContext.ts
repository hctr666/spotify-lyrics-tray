import { createContext } from 'react'

import { TrackServiceState } from '~/types/track-service'

export const TrackServiceContext = createContext<TrackServiceState>({})
