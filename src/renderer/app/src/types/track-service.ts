export type LyricsLine = {
  id?: string
  startTimeMs: string
  words: string
  syllables: string[]
  endTimeMs: string
}

export interface Lyrics {
  lines: LyricsLine[]
  syncType: 'LINE_SYNCED' | 'UNSYNCED'
}

export interface TrackServiceState {
  lyrics?: Lyrics
  isLoading?: boolean
  error?: string
}
