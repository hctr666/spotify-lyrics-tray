import { useContext } from 'react'

import { TrackServiceContext } from '~/contexts/TrackServiceProvider/TrackServiceContext'

export const useTrackService = () => useContext(TrackServiceContext)
