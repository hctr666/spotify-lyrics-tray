import { useTrackService } from '~/hooks/useTrackService'
import { usePlaybackState } from '~/hooks/usePlaybackState'
import { SyncedLyrics } from '../SyncedLyrics'
import { UnsyncedLyrics } from '../UnsyncedLyrics'

export const LyricsViewer = () => {
  const { lyrics, isLoading } = useTrackService()
  const { playbackState } = usePlaybackState()

  if (playbackState?.isInactive) {
    return (
      <div className='text-gray-400 text-sm p-3 block'>
        <span className='block'>
          Playback inactive or in private session, please open your Spotify app,
          make sure private session is not enabled and play a song!
        </span>
      </div>
    )
  }

  if (isLoading || !lyrics) {
    return <span className='text-white'>Loading...</span>
  }

  if (!lyrics.lines) {
    return (
      <span className='text-white block mt-4'>
        Could'n find lyrics for this track
      </span>
    )
  }

  return (
    <>
      {lyrics?.isLineSynced ? (
        <SyncedLyrics progress={playbackState?.progress} lyrics={lyrics} />
      ) : (
        <UnsyncedLyrics lyrics={lyrics} />
      )}
    </>
  )
}
