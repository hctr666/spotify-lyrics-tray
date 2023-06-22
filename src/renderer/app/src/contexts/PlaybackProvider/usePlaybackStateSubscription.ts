import { useCallback, useEffect } from 'react'
import { useAuth } from '~/hooks/useAuth/useAuth'
import { PlaybackState } from '~/types/playback'

interface UseStateSubscriptionProps {
  onStateChange: (state: PlaybackState) => void
}

export const usePlaybackStateSubscription = ({
  onStateChange,
}: UseStateSubscriptionProps) => {
  const { isAuthenticated } = useAuth()

  const fetchPlaybackState = useCallback(async () => {
    const state = await window.Playback.getState()

    onStateChange(state)
  }, [onStateChange])

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaybackState()
    }

    const unsubscribe = window.Playback.subscribeOnState((_event, state) => {
      onStateChange(state)
    })

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  return fetchPlaybackState
}
