import type { IpcRendererEvent } from 'electron'
import type { AuthState } from '../contexts/AuthProvider/AuthContext'
import type { Lyrics, LyricsColors } from './lyrics'
import type { PlaybackState } from './playback'
import type { LyricsServiceState } from './lyrics-service'
import { Track } from './track'

declare global {
  type ElectronRendererListener<T> = (event: IpcRendererEvent, value: T) => void
  type UnsubscribeFunction = () => void
  type LogPayload = string | Record<string, string>
  type AuthStateListener = ElectronRendererListener<AuthState>
  type LyricsServiceStateListener = ElectronRendererListener<LyricsServiceState>
  type RGBObject = {
    r: string
    g: string
    b: string
  }

  type TrackLyricsRequestListener = (
    event: IpcRendererEvent,
    value: {
      lyrics: Lyrics
      colors: LyricsColors
    },
    error: string
  ) => void

  type PlaybackStateListener = ElectronRendererListener<PlaybackState>

  interface Window {
    Auth: {
      signIn: () => void
      signOut: () => void
      subscribe: (listener: AuthStateListener) => UnsubscribeFunction
    }
    Core: {
      log: (payload: LogPayload, level: 'info' | 'error') => void
      isDev: () => boolean
    }
    LyricsService: {
      connect: () => void
      requestServiceState: () => void
      subscribeOnServiceState: (
        listener: LyricsServiceStateListener
      ) => UnsubscribeFunction
    }
    Track: {
      getTrack: (trackId: string) => Promise<Track>
      requestLyrics: (trackId: string, imageUrl: string) => void
      subscribeOnLyrics: (
        listener: TrackLyricsRequestListener
      ) => UnsubscribeFunction
    }
    Playback: {
      play: (deviceId: string, positionMS: number) => Promise<void>
      pause: (deviceId: string) => Promise<void>
      skipToNext: (deviceId: string) => Promise<void>
      skipToPrevious: (deviceId: string) => Promise<void>
      getState: () => Promise<PlaybackState>
      subscribeOnState: (listener: PlaybackStateListener) => UnsubscribeFunction
    }
  }
}
