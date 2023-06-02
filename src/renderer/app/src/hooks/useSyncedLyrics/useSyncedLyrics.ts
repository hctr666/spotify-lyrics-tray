import { useEffect, useMemo, useRef } from 'react'

import { Lyrics } from '~/types/track-service'

export interface UseSyncedLyricsProps {
  lyrics?: Lyrics
  progress?: number
  updateProgress: (progress: number) => void
}

export const useSyncedLyrics = ({
  lyrics,
  progress = 0,
  updateProgress,
}: UseSyncedLyricsProps) => {
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

    if (progress < Number(firstLine.startTimeMs)) {
      return {
        activeLine: null,
        wait: Number(firstLine.startTimeMs) - progress,
        lines,
      }
    }

    const activeLine = [...lines].reduce(
      (prevLine, currentLine, idx, _lines) => {
        if (Number(currentLine.startTimeMs) <= progress) {
          const nextLine = _lines[idx + 1]

          wait = nextLine ? Number(nextLine.startTimeMs) - progress : 0

          return currentLine
        }
        _lines.splice(1) // break the loop

        return prevLine
      },
      firstLine
    )

    return { lines, activeLine, wait }
  }, [lyrics, progress])

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateProgress(progress + wait)
    }, wait)

    return () => {
      clearTimeout(timeout)
    }
  }, [activeLine, updateProgress, progress, wait])

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [progress])

  return { activeLine, activeLineRef, lines, wait }
}
