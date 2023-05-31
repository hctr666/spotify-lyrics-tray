import { useEffect, useMemo, useRef, useState } from 'react'

import { LyricsLine, Track } from '~/types/track-service'

export const useSyncedLyrics = (currentTrack?: Track) => {
  const initialProgress = currentTrack?.progress || 0
  const [progress, setProgress] = useState(initialProgress)
  const activeLineRef = useRef<HTMLDivElement | null>(null)

  const { activeLine, wait, lines } = useMemo(() => {
    let activeLine: Partial<LyricsLine> | null = null
    let lines: LyricsLine[] = []
    let wait = 0

    if (!currentTrack?.lyrics) {
      return { activeLine, wait, lines }
    }

    lines = currentTrack.lyrics.lines.map((line, idx) => ({
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
  }, [currentTrack, progress])

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
