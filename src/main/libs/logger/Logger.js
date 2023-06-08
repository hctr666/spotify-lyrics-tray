const log = require('electron-log')
const { isDevelopment } = require('../../helpers/environment')

const infoLogger = log.create({ logId: 'info-log' })
const errorLogger = log.create({ logId: 'error-log' })

class Logger {
  constructor(options) {
    log.initialize(options)

    if (!isDevelopment()) {
      infoLogger.transports.file.fileName = 'info.log'
      errorLogger.transports.file.fileName = 'error.log'
    } else {
      log.transports.file.level = false
    }
  }

  logInfo = message => {
    infoLogger.info(message)
  }

  logError = error => {
    errorLogger.error(error)
  }
}

module.exports = new Logger({ preload: true })
