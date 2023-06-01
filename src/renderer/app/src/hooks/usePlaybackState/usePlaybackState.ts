import { useContext } from 'react'

import { PlaybackStateContext } from '~/contexts/PlaybackStateProvider/PlaybackStateContext'

export const usePlaybackState = () => useContext(PlaybackStateContext)
