const Logger = require('electron-log')

const { isDevelopment } = require('../../helpers/environment')

const configLogger = () => {
  Logger.initialize({
    preload: true,
  })

  if (isDevelopment()) {
    Logger.transports.file.level = false
  }

  Logger.hooks.push(message => {
    if (!isDevelopment()) {
      return message
    }

    if (message.level === 'info') {
      Logger.transports.file.fileName = 'info.log'
    }

    if (message.level === 'error') {
      Logger.transports.file.fileName = 'error.log'
    }

    return message
  })
}

module.exports = {
  configLogger,
  Logger: Object.assign(Logger, {
    logInfo: Logger.info,
    logError: Logger.error,
  }),
}
