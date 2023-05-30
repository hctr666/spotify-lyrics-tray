import type { IpcRendererEvent } from 'electron'
import type { AuthState } from '../contexts/AuthStateProvider/AuthStateContext'
import type {
  LyricsConnectionStatus,
  Track,
} from '~/hooks/useLyricsService/types'

declare global {
  type ElectronRendererListener<T> = (event: IpcRendererEvent, value: T) => void
  type UnsubscribeFunction = () => void

  type AuthStateListener = ElectronRendererListener<AuthState>
  type LyricsServiceConnectionListener =
    ElectronRendererListener<LyricsConnectionStatus>
  type LyricsServiceStateListener = ElectronRendererListener<Track>

  type LogPayload = {
    ctx: unknown
    [key: string]: unknown
  }

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
    Lyrics: {
      connect: () => void
      requestConnectionStatus: () => void
      subscribeOnConnectionStatus: (
        listener: LyricsServiceConnectionListener
      ) => UnsubscribeFunction
    }
    Track: {
      requestCurrentTrack: () => void
      subscribeOnCurrentTrack: (
        listener: LyricsServiceStateListener
      ) => UnsubscribeFunction
    }
  }
}
