import { useSyncedLyrics } from '~/hooks/useSyncedLyrics'
import { Track } from '~/types/track-service'

export const SyncedLyrics = ({ track }: { track?: Track }) => {
  const { activeLine, activeLineRef, lines } = useSyncedLyrics(track)

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
