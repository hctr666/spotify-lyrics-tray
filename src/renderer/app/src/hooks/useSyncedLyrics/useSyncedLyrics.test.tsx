import { act, renderHook } from '@testing-library/react'

import { UseSyncedLyricsProps, useSyncedLyrics } from './useSyncedLyrics'
import { Lyrics } from '~/types/track-service'

jest.useFakeTimers()

const lyricsMock: Lyrics = {
  lines: [
    {
      startTimeMs: '320',
      endTimeMs: '0',
      syllables: [],
      words: 'line word 1',
    },
    {
      startTimeMs: '2120',
      endTimeMs: '0',
      syllables: [],
      words: 'line word 2',
    },
    {
      startTimeMs: '4389',
      endTimeMs: '0',
      syllables: [],
      words: 'line word 3',
    },
    {
      startTimeMs: '5781',
      endTimeMs: '0',
      syllables: [],
      words: 'line word 4',
    },
    {
      startTimeMs: '8724',
      endTimeMs: '0',
      syllables: [],
      words: 'line word 5',
    },
    {
      startTimeMs: '14170',
      endTimeMs: '0',
      syllables: [],
      words: 'line word 6',
    },
  ],
  isLineSynced: true,
}

const expectedLines = lyricsMock.lines.map((line, idx) => ({
  id: `line-${idx}`,
  ...line,
}))

const mockedUpdateProgress = jest.fn()

const renderUseSyncedLyrics = ({ progress }: Partial<UseSyncedLyricsProps>) => {
  return renderHook(() =>
    useSyncedLyrics({
      progress,
      lyrics: lyricsMock,
      updateProgress: mockedUpdateProgress,
    })
  )
}

const advanceTimer = (_wait: number) => {
  act(() => {
    jest.advanceTimersByTime(_wait)
  })
}

describe('useSyncedLyrics', () => {
  it('returns the correct line when progress is in the middle of the song', () => {
    const { result } = renderUseSyncedLyrics({ progress: 5000 })

    expect(result.current).toEqual({
      activeLine: expectedLines[2],
      activeLineRef: { current: null },
      lines: expectedLines,
      wait: 781,
    })
  })

  it('does not return a line when progress is less than the first start time', () => {
    const { result } = renderUseSyncedLyrics({ progress: 240 })

    expect(result.current).toEqual({
      activeLine: null,
      activeLineRef: { current: null },
      lines: expectedLines,
      wait: 80,
    })
  })

  it('returns the last line when progress is greater than the maximum start time', () => {
    const { result } = renderUseSyncedLyrics({ progress: 16700 })

    expect(result.current).toEqual({
      activeLine: expectedLines[5],
      activeLineRef: { current: null },
      lines: expectedLines,
      wait: 0,
    })
  })

  it('updates progress after wait time', () => {
    const { result } = renderUseSyncedLyrics({
      progress: 3400,
    })

    expect(result.current).toEqual({
      activeLine: expectedLines[1],
      activeLineRef: { current: null },
      lines: expectedLines,
      wait: 989,
    })

    advanceTimer(989)

    expect(mockedUpdateProgress).toHaveBeenCalledWith(4389)
  })
})
