export type LyricsLine = {
  id?: string
  startTimeMs: string
  words: string
  syllables: string[]
  endTimeMs: string
}

export interface Lyrics {
  lines: LyricsLine[]
  isLineSynced: boolean
}

export interface TrackServiceState {
  lyrics?: Lyrics
  isLoading?: boolean
  error?: string
}
