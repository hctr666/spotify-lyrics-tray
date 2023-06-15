import { useNavigate } from 'react-router-dom'
import { HiCog } from 'react-icons/hi'

import { Page } from '~/components'
import { LyricsViewer } from '~/components/LyricsViewer'
import { Playback } from '~/components/Playback'

export const PageHome = () => {
  const navigate = useNavigate()

  const handleSettingsClick = () => {
    navigate('/settings')
  }

  return (
    <Page>
      <Page.Header>
        <button
          onClick={handleSettingsClick}
          className='text-gray-900 text-2xl fixed top-3 right-2'
        >
          <HiCog />
        </button>
      </Page.Header>
      <Page.Content noHeader noPaddingX>
        <LyricsViewer />
        <Playback />
      </Page.Content>
    </Page>
  )
}
