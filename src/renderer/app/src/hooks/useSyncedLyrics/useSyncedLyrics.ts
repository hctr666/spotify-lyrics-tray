import { useEffect, useMemo, useRef, useState } from 'react'

import { Lyrics, LyricsLine } from '~/types/track-service'

interface UseSyncedLyricsProps {
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
    let activeLine: Partial<LyricsLine> | null = null
    let lines: LyricsLine[] = []
    let wait = 0

    if (!lyrics) {
      return { activeLine, wait, lines }
    }

    lines = lyrics.lines.map((line, idx) => ({
      id: `line-${idx}`,
      ...line,
    }))

    activeLine = lines.reduce((prevLine, currentLine, idx, lines) => {
      if (Number(currentLine.startTimeMs) <= progress) {
        const nextLine = lines[idx + 1]

        if (nextLine) {
          wait = Number(nextLine.startTimeMs) - progress
        }

        return currentLine
      }
      return prevLine
    }, {})

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

  return { activeLine, activeLineRef, lines }
}
