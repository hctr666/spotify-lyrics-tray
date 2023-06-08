import { useTrackService } from '~/hooks/useTrackService'
import { usePlaybackState } from '~/hooks/usePlaybackState'
import { SyncedLyrics } from '../SyncedLyrics'
import { UnsyncedLyrics } from '../UnsyncedLyrics'

export const LyricsViewer = () => {
  const { lyrics, error, isLoading } = useTrackService()
  const { playbackState } = usePlaybackState()
  const lyricsNotFound = !lyrics || !lyrics.lines

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

  if (error) {
    return <span className='text-red-500'>{error}</span>
  }

  if (isLoading) {
    return <span className='text-white'>Loading...</span>
  }

  if (lyricsNotFound) {
    return (
      <span className='text-white block mt-4'>
        Could'n find lyrics for this track
      </span>
    )
  }

  return (
    <>
      {lyrics?.syncType === 'LINE_SYNCED' ? (
        <SyncedLyrics progress={playbackState?.progress} lyrics={lyrics} />
      ) : (
        <UnsyncedLyrics lyrics={lyrics} />
      )}
    </>
  )
}
