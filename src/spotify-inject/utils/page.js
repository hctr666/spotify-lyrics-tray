import {
  DATA_LAYER_EVENT,
  GEARS_BUTTON_SELECTOR,
  IMMEDIATELLY_SEND_SERVICE_STATE,
  LOGIN_BUTTON_SELECTOR,
  LOGOUT_BUTTON_SELECTOR,
  MENU_BUTTON_SELECTOR,
  SESSION_DATA_SCRIPT_SELECTOR,
} from '../constants'
import errors from '../errors'
import { waitForElement } from './core'
import { setLocalValue } from './local-storage'
import { logInfo } from './log'

export const getAppData = () => {
  if (!('dataLayer' in window)) {
    throw new Error(errors.NO_WEBPLAYER_DATA)
  }

  return window?.dataLayer
    .filter(({ event }) => event === DATA_LAYER_EVENT)
    .map(data => ({
      isLoggedIn: data.loggedIn,
      isPremium: data.isPremium,
    }))?.[0]
}

export const getAccessToken = () => {
  const sessionData = document.querySelector(SESSION_DATA_SCRIPT_SELECTOR)

  if (sessionData) {
    try {
      const jsonData = JSON.parse(sessionData.innerHTML)
      return jsonData.accessToken
    } catch (_) {
      throw new Error(errors.NO_ACCESS_TOKEN)
    }
  }

  return null
}

export const logout = async () => {
  try {
    const gearButton = await waitForElement(GEARS_BUTTON_SELECTOR)
    gearButton.click()

    const logoutButton = await waitForElement(LOGOUT_BUTTON_SELECTOR)

    setLocalValue(IMMEDIATELLY_SEND_SERVICE_STATE, '1')
    logoutButton.click()

    logInfo('logging out...')
  } catch (error) {
    throw new Error(error.message)
  }
}

export const login = async () => {
  try {
    const menuButton = await waitForElement(MENU_BUTTON_SELECTOR)
    menuButton.click()

    const loginButton = await waitForElement(LOGIN_BUTTON_SELECTOR)

    setLocalValue(IMMEDIATELLY_SEND_SERVICE_STATE, '1')
    loginButton.click()

    logInfo('Redirecting to login page...')
  } catch (error) {
    throw new Error(error.message)
  }
}
