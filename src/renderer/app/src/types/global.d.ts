import type { IpcRendererEvent } from 'electron'
import type { AuthState } from '../contexts/AuthStateProvider/AuthStateContext'
import type { LyricsConnectionStatus } from '~/hooks/useLyricsService/types'
import type { Lyrics } from './track-service'
import { PlaybackState } from './playback-state'

declare global {
  type ElectronRendererListener<T> = (event: IpcRendererEvent, value: T) => void
  type UnsubscribeFunction = () => void

  type LogPayload = {
    ctx: unknown
    [key: string]: unknown
  }

  type AuthStateListener = ElectronRendererListener<AuthState>
  type LyricsServiceConnectionListener =
    ElectronRendererListener<LyricsConnectionStatus>
  type TrackLyricsRequestListener = ElectronRendererListener<Lyrics>
  type PlaybackStateListener = ElectronRendererListener<PlaybackState>

  interface Window {
    Auth: {
      signIn: () => void
      signOut: () => void
      subscribe: (listener: AuthStateListener) => UnsubscribeFunction
    }
    Core: {
      log: (payload: LogPayload) => void
      isDev: () => boolean
    }
    LyricsService: {
      connect: () => void
      requestConnectionStatus: () => void
      subscribeOnConnectionStatus: (
        listener: LyricsServiceConnectionListener
      ) => UnsubscribeFunction
    }
    Track: {
      requestLyrics: (trackId) => void
      subscribeOnLyrics: (
        listener: TrackLyricsRequestListener
      ) => UnsubscribeFunction
    }
    PlaybackState: {
      getState: () => Promise<PlaybackState>
      subscribeOnState: (listener: PlaybackStateListener) => UnsubscribeFunction
    }
  }
}
