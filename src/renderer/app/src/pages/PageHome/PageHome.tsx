import { useNavigate } from 'react-router-dom'

import { Page } from '~/components'
import { SyncedLyrics } from '~/components/SyncedLyrics/SyncedLyrics'
import { UnsyncedLyrics } from '~/components/UnsyncedLyrics'
import { useTrackService } from '~/hooks/useTrackService'

export const PageHome = () => {
  const { currentTrack } = useTrackService()
  const navigate = useNavigate()

  const handleSettingsClick = () => {
    navigate('/settings')
  }

  return (
    <Page>
      <Page.Header>
        <span>Track</span>
        <button onClick={handleSettingsClick} className='text-xl'>
          ⚙
        </button>
      </Page.Header>
      <Page.Content>
        {currentTrack?.lyrics?.isLineSynced ? (
          <SyncedLyrics track={currentTrack} />
        ) : (
          <UnsyncedLyrics track={currentTrack} />
        )}
      </Page.Content>
    </Page>
  )
}
