import { useContext } from 'react'

import { AuthStateContext } from '~/contexts/AuthStateProvider/AuthStateContext'

export const useAuthState = () => useContext(AuthStateContext)
