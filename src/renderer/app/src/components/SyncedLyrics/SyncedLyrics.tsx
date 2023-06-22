import { usePlayback } from '~/hooks/usePlayback'
import { useSyncedLyrics } from '~/hooks/useSyncedLyrics'
import { Lyrics } from '~/types/lyrics'

interface SyncedLyricsProps {
  lyrics?: Lyrics
}

// TODO: implement css animation based scroll into view
export const SyncedLyrics = ({ lyrics }: SyncedLyricsProps) => {
  const { playbackState, updateProgress } = usePlayback()
  const { progress, isPlaying } = playbackState
  const { activeLine, activeLineRef, lines } = useSyncedLyrics({
    isPlaying,
    lyrics,
    progress,
    updateProgress,
  })

  return (
    <div className='synced-lyrics-container'>
      <div className='synced-lyrics-lines'>
        {lines?.map(line => {
          if (activeLine?.id === line.id) {
            return (
              <div
                ref={activeLineRef}
                className='synced-lyrics-line--active'
                key={line.id}
              >
                {line.words}
              </div>
            )
          }

          return (
            <div className='synced-lyrics-line' key={line.id}>
              {line.words}
            </div>
          )
        })}
      </div>
    </div>
  )
}
