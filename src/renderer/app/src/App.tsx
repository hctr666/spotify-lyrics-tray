import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from 'react-router-dom'

import { PageLogin } from './pages/PageLogin'
import { AuthStateProvider } from './contexts/AuthStateProvider'
import { PageHome } from './pages/PageHome/PageHome'
import { LyricsServiceProvider } from './contexts/LyricsServiceProvider'
import { TrackServiceProvider } from './contexts/TrackServiceProvider'
import { useAuthState } from './hooks/useAuthState/useAuthState'
import { PageSettings } from './pages/PageSettings'

const ProtectedPagesRoot = () => {
  const authState = useAuthState()

  if (authState.isAuthenticated) {
    return <Outlet />
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
              <Route path='/' element={<ProtectedPagesRoot />}>
                <Route path='/settings' element={<PageSettings />} />
                <Route path='/home' element={<PageHome />} />
              </Route>
            </Routes>
          </TrackServiceProvider>
        </LyricsServiceProvider>
      </AuthStateProvider>
    </Router>
  )
}

export default App
