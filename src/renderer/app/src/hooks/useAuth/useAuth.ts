import { useContext } from 'react'

import { AuthContext } from '~/contexts/AuthProvider/AuthContext'

export const useAuth = () => useContext(AuthContext)
