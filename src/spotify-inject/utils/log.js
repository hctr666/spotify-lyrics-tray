export const logError = message => {
  window.Core.log(
    JSON.stringify({
      source: 'spotify-inject',
      message,
    }),
    'error'
  )
}

export const logInfo = message => {
  window.Core.log(
    JSON.stringify({
      source: 'spotify-inject',
      message,
    }),
    'info'
  )
}
