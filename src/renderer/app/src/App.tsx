import { ReactElement } from 'react'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { PageLogin } from './pages/PageLogin'
import { AuthStateProvider } from './contexts/AuthStateProvider'
import { PageHome } from './pages/PageHome/PageHome'
import { LyricsServiceProvider } from './contexts/LyricsServiceProvider'
import { TrackServiceProvider } from './contexts/TrackServiceProvider'
import { useAuthState } from './hooks/useAuthState/useAuthState'

const ProtectedPageWrapper = ({ children }: { children: ReactElement }) => {
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
          <TrackServiceProvider>
            <Routes>
              <Route path='/login' element={<PageLogin />} />
              <Route
                path='/'
                element={
                  <ProtectedPageWrapper>
                    <PageHome />
                  </ProtectedPageWrapper>
                }
              />
            </Routes>
          </TrackServiceProvider>
        </LyricsServiceProvider>
      </AuthStateProvider>
    </Router>
  )
}

export default App
