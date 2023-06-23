import { useMemo } from 'react'

import { Lyrics } from '~/types/lyrics'

interface UnsyncedLyricsProps {
  lyrics?: Lyrics
}

// TODO: reset scroll once lyrics change from synced to unsynced
export const UnsyncedLyrics = ({ lyrics }: UnsyncedLyricsProps) => {
  const lines = useMemo(() => {
    return lyrics?.lines?.map((line, idx) => ({
      idx: `line-${idx}`,
      ...line,
    }))
  }, [lyrics])

  return (
    <div className='unsynced-lyrics-container'>
      <div className='text-gray-300 text-sm'>
        These lyrics aren't synced to the song yet
      </div>
      <div className='unsynced-lyrics-lines'>
        {lines &&
          lines?.map(line => {
            return (
              <div key={line.id} className='text-white'>
                {line.words}
              </div>
            )
          })}
      </div>
    </div>
  )
}
