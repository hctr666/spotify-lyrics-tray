import { useMemo } from 'react'

import type { Lyrics } from '~/types/track-service'

interface UnsyncedLyricsProps {
  lyrics: Lyrics
}

export const UnsyncedLyrics = ({ lyrics }: UnsyncedLyricsProps) => {
  const lines = useMemo(() => {
    return lyrics?.lines?.map((line, idx) => {
      return {
        idx: `line-${idx}`,
        ...line,
      }
    })
  }, [lyrics])

  return (
    <div className='unsynced-lyrics-container'>
      <div className='text-gray-400 text-sm'>
        This lyrics aren't synced to song yet
      </div>
      <div className='unsynced-lyrics-lines'>
        {lines && lines.length ? (
          lines?.map(line => {
            return (
              <div key={line.id} className='text-white'>
                {line.words}
              </div>
            )
          })
        ) : (
          <span className='text-white'>No lyrics found for this track</span>
        )}
      </div>
    </div>
  )
}
