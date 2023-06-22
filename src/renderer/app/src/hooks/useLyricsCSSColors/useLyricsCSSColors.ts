import { useMemo } from 'react'

import { rgbToCSS } from '~/helpers/colors'
import { LyricsColors } from '~/types/lyrics'

export const useLyricsCSSColors = (colors?: LyricsColors) => {
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

  return { textColor, backgroundColor, highlightColor }
}
