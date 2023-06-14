import { useNavigate } from 'react-router-dom'
import { HiCog } from 'react-icons/hi'

import { Page } from '~/components'
import { LyricsViewer } from '~/components/LyricsViewer'

export const PageHome = () => {
  const navigate = useNavigate()

  const handleSettingsClick = () => {
    navigate('/settings')
  }

  return (
    <Page>
      <Page.Header>
        <span>Track</span>
        <button onClick={handleSettingsClick} className='text-xl'>
          <HiCog />
        </button>
      </Page.Header>
      <Page.Content noPaddingX>
        <LyricsViewer />
      </Page.Content>
    </Page>
  )
}
