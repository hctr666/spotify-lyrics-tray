import { useEffect } from 'react'

import { useTrackLyrics } from '~/hooks/useTrackLyrics'
import { usePlaybackState } from '~/hooks/usePlaybackState'
import { SyncedLyrics } from '../SyncedLyrics'
import { UnsyncedLyrics } from '../UnsyncedLyrics'
import { useLyricsCSSColors } from '~/hooks/useLyricsCSSColors/useLyricsCSSColors'

const setStyleProperties = (styleMap: Record<string, string>) => {
  Object.keys(styleMap).forEach(prop => {
    if (styleMap[prop]) {
      document.documentElement.style.setProperty(prop, styleMap[prop])
    }
  })
}

export const LyricsViewer = () => {
  const { lyrics, error, isLoading, colors } = useTrackLyrics()
  const { playbackState } = usePlaybackState()
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

  if (playbackState?.isInactive) {
    return (
      <div className='text-gray-400 text-sm p-3 block'>
        <span className='block'>
          Playback inactive or in private session, please open your Spotify app,
          make sure private session is not enabled and play a song!
        </span>
      </div>
    )
  }

  if (error) {
    return <span className='text-red-500'>{error}</span>
  }

  if (isLoading) {
    return <span className='text-white'>Loading...</span>
  }

  if (lyricsNotFound) {
    return (
      <span className='text-white block mt-4'>
        Could'n find lyrics for this track
      </span>
    )
  }

  return (
    <div className='lyrics-viewer-container'>
      {lyrics?.syncType === 'LINE_SYNCED' ? (
        <SyncedLyrics progress={playbackState?.progress} lyrics={lyrics} />
      ) : (
        <UnsyncedLyrics lyrics={lyrics} />
      )}
    </div>
  )
}
