import { useNavigate } from 'react-router-dom'

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
          ⚙
        </button>
      </Page.Header>
      <Page.Content>
        <LyricsViewer />
      </Page.Content>
    </Page>
  )
}
