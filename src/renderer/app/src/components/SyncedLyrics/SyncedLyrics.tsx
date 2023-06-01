import { useSyncedLyrics } from '~/hooks/useSyncedLyrics'
import { Lyrics } from '~/types/track-service'

interface SyncedLyricsProps {
  lyrics?: Lyrics
  progress?: number
}

// TODO: implement sync pause when the song is not playing
// TODO: enhanced animation, use css
export const SyncedLyrics = ({ progress, lyrics }: SyncedLyricsProps) => {
  const { activeLine, activeLineRef, lines } = useSyncedLyrics({
    lyrics,
    initialProgress: progress,
  })

  return (
    <div className='synced-lyrics-container'>
      <div className='synced-lyrics-lines'>
        {lines?.map(line => {
          if (activeLine?.id === line.id) {
            return (
              <div ref={activeLineRef} className='text-white' key={line.id}>
                {line.words}
              </div>
            )
          }

          return <div key={line.id}>{line.words}</div>
        })}
      </div>
    </div>
  )
}
