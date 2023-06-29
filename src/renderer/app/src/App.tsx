import { HashRouter as Router, Route, Routes } from 'react-router-dom'

import { PageLogin } from './pages/PageLogin'
import { AuthProvider } from './contexts/AuthProvider'
import { PageHome } from './pages/PageHome/PageHome'
import { LyricsServiceStateProvider } from './contexts/LyricsServiceStateProvider'
import { LyricsProvider } from './contexts/LyricsProvider'
import { PageSettings } from './pages/PageSettings'
import { PlaybackProvider } from './contexts/PlaybackProvider/PlaybackProvider'
import { NotificationContainer } from './components/NotificationContainer'
import { ProtectedRouteElement } from './components/ProtectedRouteElement'
import { TrackProvider } from './contexts/TrackProvider'
import { LyricsDependantPage } from './components/LyricsDependantPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <LyricsServiceStateProvider>
          <PlaybackProvider>
            <TrackProvider>
              <LyricsProvider>
                <Routes>
                  <Route path='/login' element={<PageLogin />} />
                  <Route
                    path='/settings'
                    element={
                      <ProtectedRouteElement element={<PageSettings />} />
                    }
                  />
                  <Route
                    path='/'
                    element={
                      <ProtectedRouteElement
                        element={<LyricsDependantPage page={<PageHome />} />}
                      />
                    }
                  />
                </Routes>
              </LyricsProvider>
            </TrackProvider>
          </PlaybackProvider>
        </LyricsServiceStateProvider>
      </AuthProvider>
      <NotificationContainer />
    </Router>
  )
}

export default App
