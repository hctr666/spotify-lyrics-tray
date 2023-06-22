import { usePlayback } from '~/hooks/usePlayback'
import { useSyncedLyrics } from '~/hooks/useSyncedLyrics'
import { Lyrics } from '~/types/lyrics'

interface SyncedLyricsProps {
  lyrics?: Lyrics
}

// TODO: implement sync pause when the song is not playing
// TODO: enhanced animation, use css
export const SyncedLyrics = ({ lyrics }: SyncedLyricsProps) => {
  const { playbackState, updateProgress } = usePlayback()
  const { progress } = playbackState
  const { activeLine, activeLineRef, lines } = useSyncedLyrics({
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
