import { ELEMENT_WAIT_TIMEOUT } from '../constants'
import errors from '../errors'

export const getComputedRGB = value => {
  const rgb = {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: 255 & value,
  }
  return rgb
}

export const waitForElement = (selector, wait = ELEMENT_WAIT_TIMEOUT) => {
  return new Promise((resolve, reject) => {
    let element = document.querySelector(selector)

    // immediatelly resolves element when it's found early
    if (element) {
      return resolve(element)
    }

    let interval, timeout, observer

    const flush = () => {
      clearTimeout(timeout)
      clearInterval(interval)
      observer.disconnect()
      timeout = null
      interval = null
    }

    observer = new MutationObserver(() => {
      element = document.querySelector(selector)

      if (element) {
        flush()
        resolve(element)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    interval = setInterval(() => {
      if (element) {
        flush()
        resolve(element)
      }
    }, 500)

    // Rejects when not found after timeout
    timeout = setTimeout(() => {
      if (!element) {
        flush()
        reject({ message: `${errors.ELEMENT_NOT_FOUND}: ${selector}` })
      }
    }, wait)
  })
}
