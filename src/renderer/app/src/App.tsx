import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { PageLogin } from './pages/PageLogin'
import { AuthStateProvider } from './contexts/AuthStateProvider'
import { PageHome } from './pages/PageHome/PageHome'
import { LyricsServiceProvider } from './contexts/LyricsServiceProvider'
import { TrackServiceProvider } from './contexts/TrackServiceProvider'
import { useAuthState } from './hooks/useAuthState/useAuthState'
import { PageSettings } from './pages/PageSettings'
import { PlaybackStateProvider } from './contexts/PlaybackStateProvider/PlaybackStateProvider'

// TODO: make this component to behave much like a Route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authState = useAuthState()

  if (authState.isAuthenticated) {
    return children
  }

  return <Navigate to='/login' />
}

function App() {
  return (
    <Router>
      <AuthStateProvider>
        <LyricsServiceProvider>
          <PlaybackStateProvider>
            <TrackServiceProvider>
              <Routes>
                <Route path='/login' element={<PageLogin />} />
                <Route
                  path='/settings'
                  element={
                    <ProtectedRoute>
                      <PageSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/'
                  element={
                    <ProtectedRoute>
                      <PageHome />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </TrackServiceProvider>
          </PlaybackStateProvider>
        </LyricsServiceProvider>
      </AuthStateProvider>
    </Router>
  )
}

export default App
