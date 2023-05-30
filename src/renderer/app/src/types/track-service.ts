type Lines = {
  startTimeMs: string
  words: string
  syllables: string[]
  endTimeMs: string
}[]

export interface Lyrics {
  lines: Lines
  isLineSynced: boolean
}

export interface Track {
  trackId: string
  progress: number
  lyrics?: Lyrics
  isPlaying: boolean
}

export interface TrackServiceState {
  currentTrack?: Track
}
