import { useEffect, useMemo } from 'react'

import { useTrackService } from '~/hooks/useTrackService'
import { usePlaybackState } from '~/hooks/usePlaybackState'
import { SyncedLyrics } from '../SyncedLyrics'
import { UnsyncedLyrics } from '../UnsyncedLyrics'
import { rgbToCSS } from '~/helpers/colors'

export const LyricsViewer = () => {
  const { lyrics, error, isLoading, colors } = useTrackService()
  const { playbackState } = usePlaybackState()
  const lyricsNotFound = !lyrics || !lyrics.lines

  const { textColor, backgroundColor, highlightColor } = useMemo(() => {
    const highlightColor = colors?.highlightText
      ? rgbToCSS(colors.highlightText)
      : ''
    const textColor = colors?.text ? rgbToCSS(colors.text) : ''
    const backgroundColor = colors?.background
      ? rgbToCSS(colors.background)
      : ''

    return {
      textColor,
      backgroundColor,
      highlightColor,
    }
  }, [colors])

  // TODO: optimize property updates
  useEffect(() => {
    if (textColor) {
      document.documentElement.style.setProperty(
        '--lyrics-color-text',
        textColor
      )
    }

    if (backgroundColor) {
      document.documentElement.style.setProperty(
        '--lyrics-color-background',
        backgroundColor
      )
    }

    if (highlightColor) {
      document.documentElement.style.setProperty(
        '--lyrics-color-highlight',
        highlightColor
      )
    }
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
