export type LyricsServiceStatus =
  | 'loading'
  | 'connected'
  | 'disconnected'
  | 'error'

export interface LyricsServiceState {
  status: LyricsServiceStatus
  error: null | string
}
