import { useEffect, useMemo, useRef, useState } from 'react'

import { Lyrics } from '~/types/track-service'

export interface UseSyncedLyricsProps {
  lyrics?: Lyrics
  initialProgress?: number
}

export const useSyncedLyrics = ({
  lyrics,
  initialProgress = 0,
}: UseSyncedLyricsProps) => {
  const [progress, setProgress] = useState(initialProgress)
  const activeLineRef = useRef<HTMLDivElement | null>(null)

  const { activeLine, wait, lines } = useMemo(() => {
    let wait = 0

    if (!lyrics || !lyrics.lines) {
      return { activeLine: null, wait, lines: [] }
    }

    const lines = lyrics.lines.map((line, idx) => ({
      id: `line-${idx}`,
      ...line,
    }))

    const [firstLine] = lines

    const activeLine = [...lines].reduce(
      (prevLine, currentLine, idx, _lines) => {
        if (Number(currentLine.startTimeMs) <= progress) {
          const nextLine = _lines[idx + 1]

          wait = nextLine ? Number(nextLine.startTimeMs) - progress : 0

          return currentLine
        }
        _lines.splice(1) // break the loop

        wait = Number(currentLine.startTimeMs) - progress

        return prevLine
      },
      firstLine
    )

    return { lines, activeLine, wait }
  }, [lyrics, progress])

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }

    const timeout = setTimeout(() => {
      setProgress(progress + wait)
    }, wait)

    return () => {
      clearTimeout(timeout)
    }
  }, [activeLine, progress, wait])

  return { activeLine, activeLineRef, lines, wait }
}
