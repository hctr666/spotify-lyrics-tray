import type { IpcRendererEvent } from 'electron'
import type { AuthState } from '../src/contexts/AuthStateProvider/AuthStateContext'
import type { LyricsProcessStatus } from '~/hooks/useLyricsProcess/types'

declare global {
  type ElectronRendererListener<T> = (event: IpcRendererEvent, value: T) => void
  type UnsubscribeFunction = () => void

  type AuthStateListener = ElectronRendererListener<AuthState>
  type LyricsProcessStatusListener =
    ElectronRendererListener<LyricsProcessStatus>

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
    }
    LyricsProcess: {
      connect: () => void
      subscribe: (listener: LyricsProcessStatusListener) => UnsubscribeFunction
    }
  }
}
