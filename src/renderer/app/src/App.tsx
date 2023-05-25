import { ReactElement } from 'react'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { PageLogin } from './pages/PageLogin'
import { AuthStateProvider, useAuthState } from './contexts/AuthStateProvider'
import { PageHome } from './pages/PageHome/PageHome'

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
      </AuthStateProvider>
    </Router>
  )
}

export default App
