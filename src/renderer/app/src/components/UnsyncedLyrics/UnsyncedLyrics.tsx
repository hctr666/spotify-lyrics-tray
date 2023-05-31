import { useMemo } from 'react'

import { Track } from '~/types/track-service'

export const UnsyncedLyrics = ({ track }: { track?: Track }) => {
  const lines = useMemo(() => {
    return track?.lyrics?.lines.map((line, idx) => {
      return {
        idx: `line-${idx}`,
        ...line,
      }
    })
  }, [track])

  return (
    <div className='unsynced-lyrics-container'>
      <div className='unsynced-lyrics-lines'>
        {lines?.map(line => {
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
