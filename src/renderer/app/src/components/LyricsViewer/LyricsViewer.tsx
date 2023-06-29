import { useEffect } from 'react'

import { useLyrics } from '~/hooks/useLyrics'
import { useLyricsCSSColors } from '~/hooks/useLyricsCSSColors/useLyricsCSSColors'
import { SyncedLyrics } from '../SyncedLyrics'
import { UnsyncedLyrics } from '../UnsyncedLyrics'
import { LyricsViewerSkeleton } from '../LyricsViewerSkeleton/LyricsViewerSkeleton'

const setStyleProperties = (styleMap: Record<string, string>) => {
  Object.keys(styleMap).forEach(prop => {
    if (styleMap[prop]) {
      document.documentElement.style.setProperty(prop, styleMap[prop])
    }
  })
}

export const LyricsViewer = () => {
  const { lyrics, error, isLoading, colors } = useLyrics()
  const lyricsNotFound = !lyrics || !lyrics.lines

  const { textColor, backgroundColor, highlightColor } =
    useLyricsCSSColors(colors)

  // TODO: optimize property updates
  useEffect(() => {
    setStyleProperties({
      '--lyrics-color-background': backgroundColor,
      '--lyrics-color-highlight': highlightColor,
      '--lyrics-color-text': textColor,
    })
  }, [textColor, backgroundColor, highlightColor])

  if (error) {
    return (
      <div className='lyrics-viewer-error'>
        <span className='text-red-600 opacity-80 text-lg'>{error}</span>
      </div>
    )
  }

  if (isLoading) {
    return <LyricsViewerSkeleton />
  }

  if (lyricsNotFound) {
    return (
      <div className='lyrics-viewer-not-found'>
        <span className='text-gray-400 text-xl'>
          We couldn't find lyrics for this track
        </span>
      </div>
    )
  }

  return (
    <div className='lyrics-viewer-container'>
      {lyrics?.syncType === 'LINE_SYNCED' ? (
        <SyncedLyrics lyrics={lyrics} />
      ) : (
        <UnsyncedLyrics lyrics={lyrics} />
      )}
    </div>
  )
}
