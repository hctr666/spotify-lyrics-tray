import { useTrackService } from '~/hooks/useTrackService'
import { usePlaybackState } from '~/hooks/usePlaybackState'
import { SyncedLyrics } from '../SyncedLyrics'
import { UnsyncedLyrics } from '../UnsyncedLyrics'

export const LyricsViewer = () => {
  const { lyrics } = useTrackService()
  const { playbackState } = usePlaybackState()

  if (!lyrics) {
    return <span className='text-white'>Loading...</span>
  }

  return (
    <>
      {lyrics.isLineSynced ? (
        <SyncedLyrics progress={playbackState?.progress} lyrics={lyrics} />
      ) : (
        <UnsyncedLyrics lyrics={lyrics} />
      )}
    </>
  )
}
