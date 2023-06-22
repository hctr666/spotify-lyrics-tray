import { useContext } from 'react'

import { PlaybackContext } from '~/contexts/PlaybackProvider/PlaybackContext'

export const usePlayback = () => useContext(PlaybackContext)
