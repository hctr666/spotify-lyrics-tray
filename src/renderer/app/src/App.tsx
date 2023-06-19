import { HashRouter as Router, Route, Routes } from 'react-router-dom'

import { PageLogin } from './pages/PageLogin'
import { AuthProvider } from './contexts/AuthProvider'
import { PageHome } from './pages/PageHome/PageHome'
import { LyricsServiceProvider } from './contexts/LyricsServiceProvider'
import { TrackProvider } from './contexts/TrackProvider'
import { PageSettings } from './pages/PageSettings'
import { PlaybackStateProvider } from './contexts/PlaybackStateProvider/PlaybackStateProvider'
import { NotificationContainer } from './components/NotificationContainer'
import { ProtectedRouteElement } from './components/ProtectedRouteElement'

function App() {
  return (
    <Router>
      <AuthProvider>
        <LyricsServiceProvider>
          <PlaybackStateProvider>
            <TrackProvider>
              <Routes>
                <Route path='/login' element={<PageLogin />} />
                <Route
                  path='/settings'
                  element={<ProtectedRouteElement element={<PageSettings />} />}
                />
                <Route
                  path='/'
                  element={<ProtectedRouteElement element={<PageHome />} />}
                />
              </Routes>
            </TrackProvider>
          </PlaybackStateProvider>
        </LyricsServiceProvider>
      </AuthProvider>
      <NotificationContainer />
    </Router>
  )
}

export default App
